const mongoose = require('mongoose');

const classificationResultSchema = new mongoose.Schema({
  incident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // BERTweet results
  bertweetCategory: {
    type: String,
    required: true
  },
  bertweetConfidence: {
    type: Number,
    required: true
  },
  
  // Gemini results (if used)
  geminiAnalysis: {
    category: String,
    humanitarian: Boolean,
    urgency: String,
    requestForHelp: Boolean,
    location: String,
    explanation: String
  },
  geminiUsed: {
    type: Boolean,
    default: false
  },
  
  // Final decision
  finalCategory: {
    type: String,
    required: true
  },
  modelUsed: {
    type: String,
    enum: ['BERTweet', 'Gemini'],
    required: true
  },
  
  // Processing metadata
  processingTime: {
    type: Number
  },
  confidenceThreshold: {
    type: Number,
    default: 0.70
  }
}, {
  timestamps: true
});

// Index for analytics and debugging
classificationResultSchema.index({ incident: 1 });
classificationResultSchema.index({ bertweetCategory: 1, geminiUsed: 1 });
classificationResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ClassificationResult', classificationResultSchema);
