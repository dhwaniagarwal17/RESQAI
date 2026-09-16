const Incident = require('../models/Incident');
const ClassificationResult = require('../models/ClassificationResult');
const mlService = require('./mlService');

class IncidentService {
  async createIncident(data, userId) {
    const { message, location } = data;

    // Get ML classification
    const classificationData = await mlService.classifyMessage(message);

    // Determine final values based on model used
    let incidentData = {
      message,
      reporter: userId,
      location: location || {},
      modelUsed: classificationData.model_used,
      originalBertweetCategory: classificationData.bertweet_prediction,
      originalBertweetConfidence: classificationData.bertweet_confidence,
      geminiUsed: classificationData.gemini_used
    };

    if (classificationData.gemini_used) {
      // Gemini was used
      incidentData = {
        ...incidentData,
        category: classificationData.final_category,
        confidence: classificationData.bertweet_confidence,
        humanitarianStatus: classificationData.humanitarian,
        urgency: classificationData.urgency,
        requestForHelp: classificationData.request_for_help,
        explanation: classificationData.explanation,
        priority: this.mapUrgencyToPriority(classificationData.urgency)
      };

      // Update location if Gemini found one
      if (classificationData.location && classificationData.location !== 'NONE') {
        incidentData.location.address = classificationData.location;
      }
    } else {
      // BERTweet only
      incidentData = {
        ...incidentData,
        category: classificationData.final_category,
        confidence: classificationData.bertweet_confidence,
        priority: this.inferPriorityFromCategory(classificationData.final_category)
      };
    }

    // Create incident
    const incident = await Incident.create(incidentData);

    // Store classification result for debugging/analytics
    await ClassificationResult.create({
      incident: incident._id,
      message,
      bertweetCategory: classificationData.bertweet_prediction,
      bertweetConfidence: classificationData.bertweet_confidence,
      geminiUsed: classificationData.gemini_used,
      ...(classificationData.gemini_used && {
        geminiAnalysis: {
          category: classificationData.final_category,
          humanitarian: classificationData.humanitarian,
          urgency: classificationData.urgency,
          requestForHelp: classificationData.request_for_help,
          location: classificationData.location,
          explanation: classificationData.explanation
        }
      }),
      finalCategory: classificationData.final_category,
      modelUsed: classificationData.model_used,
      processingTime: classificationData.processingTime,
      confidenceThreshold: mlService.confidenceThreshold
    });

    // Populate reporter info
    await incident.populate('reporter', 'name email');

    return incident;
  }

  mapUrgencyToPriority(urgency) {
    const mapping = {
      'HIGH': 'critical',
      'MEDIUM': 'high',
      'LOW': 'medium'
    };
    return mapping[urgency] || 'medium';
  }

  inferPriorityFromCategory(category) {
    const highPriorityCategories = [
      'requests_or_urgent_needs',
      'injured_or_dead_people',
      'missing_or_found_people'
    ];
    
    const mediumPriorityCategories = [
      'displaced_people_and_evacuations',
      'infrastructure_and_utility_damage'
    ];

    if (highPriorityCategories.includes(category)) {
      return 'high';
    } else if (mediumPriorityCategories.includes(category)) {
      return 'medium';
    }
    return 'low';
  }

  async updateIncidentStatus(incidentId, status, userId, notes) {
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      throw new Error('Incident not found');
    }

    // Add to status history
    incident.statusHistory.push({
      status,
      updatedBy: userId,
      updatedAt: new Date(),
      notes
    });

    incident.status = status;
    await incident.save();

    return incident;
  }
}

module.exports = new IncidentService();
