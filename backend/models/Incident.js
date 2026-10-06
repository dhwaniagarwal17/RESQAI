const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    address: {
      type: String,
      trim: true
    }
  },
  
  // Final classification result
  category: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  
  // Gemini analysis fields
  humanitarianStatus: {
    type: Boolean
  },
  urgency: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH']
  },
  requestForHelp: {
    type: Boolean
  },
  explanation: {
    type: String
  },
  
  // Model metadata
  modelUsed: {
    type: String,
    enum: ['BERTweet', 'Gemini'],
    required: true
  },
  originalBertweetCategory: {
    type: String
  },
  originalBertweetConfidence: {
    type: Number
  },
  geminiUsed: {
    type: Boolean,
    default: false
  },
  
  // Rescue assignment and status
  assignedRescueTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'en_route', 'on_site', 'resolved', 'cancelled'],
    default: 'pending'
  },
  
  // Status history
  statusHistory: [{
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Additional fields
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
incidentSchema.index({ reporter: 1, createdAt: -1 });
incidentSchema.index({ assignedRescueTeam: 1, status: 1 });
incidentSchema.index({ category: 1, urgency: 1 });
incidentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
