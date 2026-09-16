const express = require('express');
const router = express.Router();
const {
  getAllIncidents,
  getIncidentStats,
  updateIncident,
  assignIncident,
  getRescueTeams
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/incidents', protect, authorize('admin'), getAllIncidents);
router.get('/incidents/stats', protect, authorize('admin'), getIncidentStats);
router.patch('/incidents/:id', protect, authorize('admin'), updateIncident);
router.post('/incidents/:id/assign', protect, authorize('admin'), assignIncident);
router.get('/rescue-teams', protect, authorize('admin'), getRescueTeams);

module.exports = router;
