const Incident = require('../models/Incident');
const incidentService = require('../services/incidentService');

// @desc    Create a new incident
// @route   POST /api/incidents
// @access  Private (Reporter, Admin)
exports.createIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.createIncident(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Incident created and classified successfully',
      data: { incident }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Private
exports.getIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('assignedRescueTeam', 'name email phone teamId')
      .populate('statusHistory.updatedBy', 'name role');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Check access: reporter can only see their own, rescue team sees assigned, admin sees all
    if (req.user.role === 'reporter' && incident.reporter._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this incident'
      });
    }

    if (req.user.role === 'rescue_team' && 
        (!incident.assignedRescueTeam || incident.assignedRescueTeam._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this incident'
      });
    }

    res.status(200).json({
      success: true,
      data: { incident }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my incidents (for reporter)
// @route   GET /api/incidents/my
// @access  Private (Reporter)
exports.getMyIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({ reporter: req.user.id })
      .populate('assignedRescueTeam', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident (limited fields for reporter)
// @route   PATCH /api/incidents/:id
// @access  Private (Reporter - owner only)
exports.updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Only the reporter who created it can update (limited fields)
    if (incident.reporter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident'
      });
    }

    // Only allow updating specific fields
    const allowedUpdates = ['location', 'notes'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('reporter', 'name email');

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: { incident: updatedIncident }
    });
  } catch (error) {
    next(error);
  }
};
