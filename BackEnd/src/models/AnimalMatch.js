const mongoose = require("mongoose");

const animalMatchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizQuestions: { type: [String], default: [] },
    quizResponses: { type: [String], default: [] },
    predictedAnimal: String,
    confidenceScore: Number,
    matchReason: String,
    strengths: [String],
    funFact: String,
    imageUrl: { type: String, default: null } // Cloudinary image URL
  },
  {
    timestamps: true
  }
);

animalMatchSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AnimalMatch", animalMatchSchema);
