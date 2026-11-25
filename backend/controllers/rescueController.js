const Incident = require('../models/Incident');
const incidentService = require('../services/incidentService');

// @desc    Get assigned incidents
// @route   GET /api/rescue/incidents
// @access  Private (Rescue Team)
exports.getAssignedIncidents = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {
      assignedRescueTeam: req.user.id
    };

    if (status) {
      filter.status = status;
    }

    const incidents = await Incident.find(filter)
      .populate('reporter', 'name email phone')
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

// @desc    Get incident details
// @route   GET /api/rescue/incidents/:id
// @access  Private (Rescue Team)
exports.getIncidentDetails = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('statusHistory.updatedBy', 'name role');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Verify this incident is assigned to this rescue team
    if (!incident.assignedRescueTeam || incident.assignedRescueTeam.toString() !== req.user.id) {
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

// @desc    Update incident status
// @route   PATCH /api/rescue/incidents/:id/status
// @access  Private (Rescue Team)
exports.updateIncidentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status transitions
    const allowedStatuses = ['accepted', 'en_route', 'on_site', 'resolved'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
      });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Verify assignment
    if (!incident.assignedRescueTeam || incident.assignedRescueTeam.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident'
      });
    }

    // Update status
    const updatedIncident = await incidentService.updateIncidentStatus(
      req.params.id,
      status,
      req.user.id,
      notes
    );

    await updatedIncident.populate('reporter', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Incident status updated successfully',
      data: { incident: updatedIncident }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add notes to incident
// @route   POST /api/rescue/incidents/:id/notes
// @access  Private (Rescue Team)
exports.addNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Notes are required'
      });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Verify assignment
    if (!incident.assignedRescueTeam || incident.assignedRescueTeam.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident'
      });
    }

    // Append to existing notes
    incident.notes = incident.notes 
      ? `${incident.notes}\n\n[${new Date().toISOString()}] ${notes}`
      : notes;

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Notes added successfully',
      data: { incident }
    });
  } catch (error) {
    next(error);
  }
};
