const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AnimalMatch = require("../models/AnimalMatch");
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./src/config/.env",
  });
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple auth middleware: attach req.userId if present
const auth = (req, res, next) => {
  const userId = req.header("x-user-id");
  if (userId) {
    req.userId = userId;
  }
  next();
};

// Utility: Safe JSON parsing
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
router.post("/start", auth, async (_req, res) => {
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
        ]
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const data = safeParseJSON(result.response.text());

    if (
      !data ||
      !Array.isArray(data.questions) ||
      data.questions.length === 0 ||
      !data.questions[0].options
    ) {
      // fallback questions
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
router.post("/fetch-animal", auth, async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (
      !Array.isArray(questions) ||
      !Array.isArray(answers) ||
      questions.length === 0 ||
      questions.length !== answers.length
    ) {
      return res.status(400).json({
        error: "questions[] and answers[] must be same-length non-empty arrays.",
      });
    }

    const qaPairs = questions.map((q, i) => ({
      question: typeof q === "string" ? q : q.question, // normalize
      answer: answers[i],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const parsed = safeParseJSON(result.response.text());

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
        raw: result.response.text(),
      });
    }

    // ✅ Save only if logged in
    if (req.userId) {
      const matchDoc = await AnimalMatch.create({
        userId: req.userId,
        quizQuestions: questions,
        quizResponses: answers,
        predictedAnimal: parsed.animalName,
        confidenceScore: parsed.confidence,
        matchReason: parsed.reason,
        strengths: parsed.strengths,
        funFact: parsed.funFact,
      });

      await User.findByIdAndUpdate(
        req.userId,
        {
          spiritAnimal: parsed.animalName,
          predictionConfidence: parsed.confidence,
        },
        { new: true }
      );

      return res.json({
        message: "Prediction successful",
        result: parsed,
        saved: { id: matchDoc._id },
      });
    }

    // ✅ Guest user → just return result
    return res.json({
      success: true,
      type: "guest",
      result: parsed,
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
router.get("/get-animal", auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "Guests do not have history. Please log in." });
    }

    const history = await AnimalMatch.find({ userId: req.userId }).sort({
      timestamp: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch history" });
  }
});

module.exports = router;
