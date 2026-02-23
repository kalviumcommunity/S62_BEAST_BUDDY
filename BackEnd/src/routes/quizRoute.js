const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AnimalMatch = require("../models/AnimalMatch");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ Fixed import
const { getOrGenerateSpiritAnimalImage } = require("../utils/spiritAnimalImageCache");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./src/config/.env",
  });
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ Fixed class name

const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (_err) {
    // Ignore invalid tokens for public routes
  }

  return next();
};

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (_e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_e2) {}
    }
    return null;
  }
}

/* ------------------------------
 1) Start quiz → generate questions
-------------------------------- */
router.post("/start", async (req, res) => {
  const fallbackQuestions = [
    {
      question: "Do you feel most energized alone or with a group?",
      options: ["Alone", "With a small group", "With a big group"],
    },
    {
      question:
        "When facing a problem, do you trust your gut or analyze details?",
      options: [
        "Always gut",
        "Mostly gut",
        "Mostly analyze",
        "Always analyze",
      ],
    },
    {
      question: "Are you more of a risk-taker or risk-avoider?",
      options: ["Big risk-taker", "Sometimes", "Rarely", "Never"],
    },
    {
      question: "Do you prefer a calm routine or fast-paced variety?",
      options: ["Calm routine", "Balanced", "Fast-paced"],
    },
    {
      question: "Which value resonates most?",
      options: ["Loyalty", "Creativity", "Freedom", "Wisdom"],
    },
  ];

  try {
    // ✅ Correct way to get model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are designing a light, fun **personality quiz** to discover a user's spirit (partner) animal.

      Produce exactly 5 short, clear multiple-choice questions that explore:
      - social energy (introvert/extrovert),
      - decision style (instinct vs analysis),
      - risk tolerance,
      - preferred pace (calm vs energetic),
      - values (loyalty, creativity, freedom, wisdom, etc).

      For each question, provide 3–4 answer options.
      Keep questions fun, simple, and no more than one sentence.

      Return ONLY JSON in this exact shape:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"]
          }
        ]
      }
    `.trim();

    // ✅ Correct generateContent usage
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const data = safeParseJSON(text);

    if (
      !data ||
      !Array.isArray(data.questions) ||
      data.questions.length === 0 ||
      !data.questions[0].options
    ) {
      return res.json({ questions: fallbackQuestions });
    }

    res.json({ questions: data.questions });
  } catch (err) {
    console.error("AI /start error:", err);
    return res.json({ questions: fallbackQuestions });
  }
});

/* ------------------------------
 2) Submit answers → AI predicts animal
-------------------------------- */
router.post("/fetch-animal", optionalAuth, async (req, res) => {
  try {
    const { questions, answers } = req.body;

    console.log("DEBUG /fetch-animal received:");
    console.log("  questions type:", typeof questions, "isArray:", Array.isArray(questions), "length:", questions?.length);
    console.log("  answers type:", typeof answers, "isArray:", Array.isArray(answers), "length:", answers?.length);
    console.log("  questions sample:", questions?.[0]);
    console.log("  answers sample:", answers?.[0]);

    if (
      !Array.isArray(questions) ||
      !Array.isArray(answers) ||
      questions.length === 0 ||
      questions.length !== answers.length
    ) {
      return res.status(400).json({
        error: "questions[] and answers[] must be same-length non-empty arrays.",
        debug: {
          questionsIsArray: Array.isArray(questions),
          answersIsArray: Array.isArray(answers),
          questionsLength: questions?.length,
          answersLength: answers?.length,
        }
      });
    }

    const qaPairs = questions.map((q, i) => ({
      question: typeof q === "string" ? q : q.question,
      answer: answers[i],
    }));

    // ✅ Correct model initialization
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
You are a personality-to-animal matching expert.
Given the user's Q/A pairs, choose the single best-fitting **spirit (partner) animal** from a broad set
(e.g., Fox, Owl, Dolphin, Wolf, Panda, Eagle, Tiger, Koala, Elephant, Hawk, Otter, Cat, Dog, Bear, Deer, Raven, Tortoise).
Be playful but clear.

Requirements:
- Provide a short **reason** for the match (1–2 sentences).
- Provide 3–5 positive **strengths** as bullet-like items (single words or short phrases).
- Provide one **funFact** about that animal.
- Provide a numeric **confidence** 0–100.

Return ONLY JSON exactly in this shape:
{
  "animalName": "string",
  "reason": "string",
  "strengths": ["string", "string", "string"],
  "funFact": "string",
  "confidence": 0
}

Q/A:
${JSON.stringify(qaPairs, null, 2)}
    `.trim();

    // ✅ Correct generateContent usage
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsed = safeParseJSON(text);

    if (
      !parsed ||
      typeof parsed.animalName !== "string" ||
      typeof parsed.reason !== "string" ||
      !Array.isArray(parsed.strengths) ||
      typeof parsed.funFact !== "string" ||
      typeof parsed.confidence !== "number"
    ) {
      return res.status(500).json({
        error: "AI returned an unexpected format.",
        raw: text,
      });
    }

    // ✅ Save only if logged in
    if (req.user?.id) {
      // Generate or fetch cached spirit animal image
      const imageUrl = await getOrGenerateSpiritAnimalImage(
        parsed.animalName,
        parsed.reason
      );

      const matchDoc = await AnimalMatch.create({
        userId: req.user.id,
        quizQuestions: questions,
        quizResponses: answers,
        predictedAnimal: parsed.animalName,
        confidenceScore: parsed.confidence,
        matchReason: parsed.reason,
        strengths: parsed.strengths,
        funFact: parsed.funFact,
        imageUrl: imageUrl, // Store image URL in match history
      });

      await User.findByIdAndUpdate(
        req.user.id,
        {
          spiritAnimal: parsed.animalName,
          predictionConfidence: parsed.confidence,
          spiritAnimalImageUrl: imageUrl, // Store image URL in user profile
        },
        { new: true }
      );

      return res.json({
        message: "Prediction successful",
        result: {
          ...parsed,
          imageUrl: imageUrl, // Include image in response
        },
        saved: { id: matchDoc._id },
      });
    }

    // ✅ Guest user → generate image but don't save
    const guestImageUrl = await getOrGenerateSpiritAnimalImage(
      parsed.animalName,
      parsed.reason
    );

    return res.json({
      success: true,
      type: "guest",
      result: {
        ...parsed,
        imageUrl: guestImageUrl, // Include image for guests too
      },
    });
  } catch (err) {
    console.error("AI /fetch-animal error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong generating the spirit animal." });
  }
});

/* ------------------------------
 3) Fetch history (only for logged-in users)
-------------------------------- */
router.get("/get-animal", authMiddleware, async (req, res) => {
  try {
    const history = await AnimalMatch.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch history" });
  }
});

module.exports = router;