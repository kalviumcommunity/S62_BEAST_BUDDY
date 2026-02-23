const cloudinary = require("cloudinary").v2;

// Try to use built-in fetch (Node 18+), fallback to node-fetch for older versions
let fetchFn;
try {
  // Node 18+ has global fetch
  fetchFn = global.fetch || fetch;
} catch (e) {
  // Fallback to node-fetch for Node 16
  fetchFn = require("node-fetch");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Normalize animal name into a deterministic identifier
 * Example: "Arctic Fox" → "arctic-fox"
 */
const normalizeAnimalName = (name) => {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

/**
 * Generate a prompt for spirit animal image generation
 * Consistent style: calm, spiritual, premium illustration
 */
const generateImagePrompt = (animalName, description) => {
  return `
A beautiful, calm spiritual illustration of a ${animalName}.
${description ? `This animal represents: ${description}` : ""}
Premium illustration style with soft lighting, warm and ethereal atmosphere.
Minimal, peaceful background. No text, no watermark. 
Spiritual, serene, professional quality. 
High resolution, detailed fur/feathers/scales, soothing colors.
  `.trim();
};

/**
 * Fetch existing image from Cloudinary by public_id
 * Returns the secure_url if found, null otherwise
 */
const getExistingImageUrl = async (animalId) => {
  try {
    const publicId = `spirit-animals/${animalId}`;
    const result = await cloudinary.api.resources_by_ids([publicId]);
    if (result && result.resources && result.resources.length > 0) {
      return result.resources[0].secure_url;
    }
  } catch (err) {
    // Resource not found or error; return null
    if (err.http_code !== 404) {
      console.warn("Error checking Cloudinary for existing image:", err.message);
    }
  }
  return null;
};

/**
 * Generate image using Replicate (Stable Diffusion)
 * and upload to Cloudinary
 */
const generateAndUploadAnimalImage = async (animalName, description) => {
  try {
    const animalId = normalizeAnimalName(animalName);
    const publicId = `spirit-animals/${animalId}`;
    const prompt = generateImagePrompt(animalName, description);

    // Call Replicate API to generate image
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      console.warn("REPLICATE_API_TOKEN not configured; using placeholder image");
      return getPlaceholderImageUrl(animalId);
    }

    const response = await fetchFn("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "9b1c3d0cea955b46910411d8f7d660e6e8c1b1ef7e6ca3129fab7dcfb75463a0", // Stable Diffusion 2.1
        input: {
          prompt: prompt,
          num_outputs: 1,
          height: 768,
          width: 768,
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    
    // Poll for completion (simple polling; production should use webhooks)
    let finalPrediction = prediction;
    let attempts = 0;
    const maxAttempts = 60; // ~5 minutes with 5s intervals

    while (
      (finalPrediction.status === "processing" || finalPrediction.status === "starting") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s
      const pollResponse = await fetchFn(
        `https://api.replicate.com/v1/predictions/${finalPrediction.id}`,
        {
          headers: { Authorization: `Token ${replicateToken}` },
        }
      );
      finalPrediction = await pollResponse.json();
      attempts++;
    }

    if (finalPrediction.status !== "succeeded" || !finalPrediction.output || finalPrediction.output.length === 0) {
      throw new Error(`Image generation failed or timed out. Status: ${finalPrediction.status}`);
    }

    const generatedImageUrl = finalPrediction.output[0];

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(generatedImageUrl, {
      public_id: publicId,
      folder: "spirit-animals",
      overwrite: false, // Prevent accidental regeneration
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (err) {
    console.error("Error generating and uploading image:", err.message);
    return getPlaceholderImageUrl(normalizeAnimalName(animalName));
  }
};

/**
 * Fallback placeholder image URL (minimal, recognizable)
 */
const getPlaceholderImageUrl = (animalId) => {
  // Return a generic placeholder; can be customized per animal if needed
  return `https://via.placeholder.com/400x400?text=${encodeURIComponent(animalId.replace("-", " "))}`;
};

/**
 * Main function: Get or generate spirit animal image
 * - Check Cloudinary first
 * - If not found, generate and upload
 * - Return the URL
 */
const getOrGenerateSpiritAnimalImage = async (animalName, description) => {
  try {
    const animalId = normalizeAnimalName(animalName);

    // 1. Check if image already exists in Cloudinary
    const existingUrl = await getExistingImageUrl(animalId);
    if (existingUrl) {
      console.log(`Using cached image for ${animalName}`);
      return existingUrl;
    }

    // 2. If not found, generate and upload
    console.log(`Generating new image for ${animalName}`);
    const newUrl = await generateAndUploadAnimalImage(animalName, description);
    return newUrl;
  } catch (err) {
    console.error("Unexpected error in getOrGenerateSpiritAnimalImage:", err.message);
    return getPlaceholderImageUrl(normalizeAnimalName(animalName));
  }
};

module.exports = {
  normalizeAnimalName,
  getOrGenerateSpiritAnimalImage,
  getExistingImageUrl,
  generateAndUploadAnimalImage,
  getPlaceholderImageUrl,
};
