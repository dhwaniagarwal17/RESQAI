const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncident,
  getMyIncidents,
  updateIncident
} = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { incidentValidation, validate } = require('../utils/validation');

router.post('/', protect, authorize('reporter', 'admin'), incidentValidation, validate, createIncident);
router.get('/my', protect, authorize('reporter'), getMyIncidents);
router.get('/:id', protect, getIncident);
router.patch('/:id', protect, authorize('reporter'), updateIncident);

module.exports = router;
