const Incident = require('../models/Incident');
const User = require('../models/User');
const incidentService = require('../services/incidentService');

// @desc    Get all incidents with filters
// @route   GET /api/admin/incidents
// @access  Private (Admin)
exports.getAllIncidents = async (req, res, next) => {
  try {
    const { category, urgency, status, priority, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const incidents = await Incident.find(filter)
      .populate('reporter', 'name email phone')
      .populate('assignedRescueTeam', 'name email phone teamId')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Incident.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: incidents.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: { incidents }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incident statistics
// @route   GET /api/admin/incidents/stats
// @access  Private (Admin)
exports.getIncidentStats = async (req, res, next) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const pendingIncidents = await Incident.countDocuments({ status: 'pending' });
    const assignedIncidents = await Incident.countDocuments({ status: 'assigned' });
    const resolvedIncidents = await Incident.countDocuments({ status: 'resolved' });

    const categoryStats = await Incident.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const urgencyStats = await Incident.aggregate([
      { $match: { urgency: { $exists: true } } },
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);

    const modelUsageStats = await Incident.aggregate([
      { $group: { _id: '$modelUsed', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalIncidents,
          pending: pendingIncidents,
          assigned: assignedIncidents,
          resolved: resolvedIncidents
        },
        byCategory: categoryStats,
        byUrgency: urgencyStats,
        byModel: modelUsageStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident details
// @route   PATCH /api/admin/incidents/:id
// @access  Private (Admin)
exports.updateIncident = async (req, res, next) => {
  try {
    const { status, priority, notes, urgency } = req.body;

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (notes) updates.notes = notes;
    if (urgency) updates.urgency = urgency;

    // Add to status history if status changed
    if (status && status !== incident.status) {
      incident.statusHistory.push({
        status,
        updatedBy: req.user.id,
        updatedAt: new Date(),
        notes: notes || `Status updated to ${status} by admin`
      });
    }

    Object.assign(incident, updates);
    await incident.save();

    await incident.populate('reporter', 'name email');
    await incident.populate('assignedRescueTeam', 'name email phone teamId');

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: { incident }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign incident to rescue team
// @route   POST /api/admin/incidents/:id/assign
// @access  Private (Admin)
exports.assignIncident = async (req, res, next) => {
  try {
    const { rescueTeamId } = req.body;

    if (!rescueTeamId) {
      return res.status(400).json({
        success: false,
        message: 'Rescue team ID is required'
      });
    }

    // Verify rescue team exists and has correct role
    const rescueTeam = await User.findById(rescueTeamId);
    
    if (!rescueTeam) {
      return res.status(404).json({
        success: false,
        message: 'Rescue team not found'
      });
    }

    if (rescueTeam.role !== 'rescue_team') {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not a rescue team member'
      });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Update incident
    incident.assignedRescueTeam = rescueTeamId;
    incident.status = 'assigned';
    
    incident.statusHistory.push({
      status: 'assigned',
      updatedBy: req.user.id,
      updatedAt: new Date(),
      notes: `Assigned to ${rescueTeam.name}`
    });

    await incident.save();

    await incident.populate('reporter', 'name email');
    await incident.populate('assignedRescueTeam', 'name email phone teamId');

    res.status(200).json({
      success: true,
      message: 'Incident assigned successfully',
      data: { incident }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rescue teams
// @route   GET /api/admin/rescue-teams
// @access  Private (Admin)
exports.getRescueTeams = async (req, res, next) => {
  try {
    const rescueTeams = await User.find({ role: 'rescue_team' })
      .select('name email phone teamId')
      .sort('name');

    res.status(200).json({
      success: true,
      count: rescueTeams.length,
      data: { rescueTeams }
    });
  } catch (error) {
    next(error);
  }
};
