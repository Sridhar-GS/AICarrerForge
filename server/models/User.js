const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  evaluations: [{
      role: String,
      resumeScore: Number,
      quizScore: Number,
      communicationScore: Number,
      portfolioScore: Number,
      overallScore: Number,
      readinessLevel: String,
      improvementPlan: [String],
      date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);