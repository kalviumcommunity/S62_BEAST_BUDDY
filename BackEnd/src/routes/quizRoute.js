const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AnimalMatch = require("../models/AnimalMatch");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const auth = (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  req.userId = userId;
  next();
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


router.post("/start", auth, async (_req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are designing a light, fun **personality quiz** to discover a user's spirit (partner) animal.
Produce exactly 5 short, clear questions that explore:
- social energy (introvert/extrovert),
- decision style (instinct vs analysis),
- risk tolerance,
- preferred pace (calm vs energetic),
- values (loyalty, creativity, freedom, wisdom, etc).

Return ONLY JSON:
{
  "questions": ["Q1", "Q2", "Q3", "Q4", "Q5"]
}
    `.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const data = safeParseJSON(result.response.text());
    if (!data || !Array.isArray(data.questions)) {
      return res.json({
        questions: [
          "Do you feel most energized alone or with a group?",
          "When facing a problem, do you trust your gut or analyze details?",
          "Are you more of a risk-taker or risk-avoider?",
          "Do you prefer a calm routine or fast-paced variety?",
          "Which value resonates most: loyalty, creativity, freedom, wisdom, or leadership?"
        ]
      });
    }
    res.json({ questions: data.questions });
  } catch (err) {
    console.error("AI /start error:", err);
    res.json({
      questions: [
        "Do you feel most energized alone or with a group?",
        "When facing a problem, do you trust your gut or analyze details?",
        "Are you more of a risk-taker or risk-avoider?",
        "Do you prefer a calm routine or fast-paced variety?",
        "Which value resonates most: loyalty, creativity, freedom, wisdom, or leadership?"
      ]
    });
  }
});

// -------------------------------------------
// 2) Submit answers → AI predicts + reasons
// Body: { questions: string[], answers: string[] }
// -------------------------------------------
router.post("/fetch-animal", auth, async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length === 0 || questions.length !== answers.length) {
      return res.status(400).json({ error: "questions[] and answers[] must be same-length non-empty arrays." });
    }

    const qaPairs = questions.map((q, i) => ({ question: q, answer: answers[i] }));

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
      return res.status(500).json({ error: "AI returned an unexpected format.", raw: result.response.text() });
    }

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

    res.json({
      message: "Prediction successful",
      result: parsed,
      saved: { id: matchDoc._id }
    });
  } catch (err) {
    console.error("AI /submit error:", err);
    res.status(500).json({ error: "Something went wrong generating the spirit animal." });
  }
});


router.get("/get-animal", auth, async (req, res) => {
  try {
    const history = await AnimalMatch.find({ userId: req.userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch history" });
  }
});

module.exports = router;
