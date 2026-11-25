const express = require('express');
const router = express.Router();
const {
  getAssignedIncidents,
  getIncidentDetails,
  updateIncidentStatus,
  addNotes
} = require('../controllers/rescueController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/incidents', protect, authorize('rescue_team'), getAssignedIncidents);
router.get('/incidents/:id', protect, authorize('rescue_team'), getIncidentDetails);
router.patch('/incidents/:id/status', protect, authorize('rescue_team'), updateIncidentStatus);
router.post('/incidents/:id/notes', protect, authorize('rescue_team'), addNotes);

module.exports = router;
