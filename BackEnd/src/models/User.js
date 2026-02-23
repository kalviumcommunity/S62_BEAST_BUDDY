const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  spiritAnimal: {
    type: String
  },
  spiritAnimalImageUrl: {
    type: String,
    default: null
  },
  confidenceScore: {
    type: Number
  },
  predictionConfidence: {
    type: Number
  },
  preferences: {
    type: {
      theme: { type: String, default: "dark" }, // dark or light
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "en" }
    },
    default: {}
  },
  streak: {
    type: Number,
    default: 0
  },
  lastQuizDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    // Update the updatedAt timestamp on every save
    this.updatedAt = Date.now();
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
