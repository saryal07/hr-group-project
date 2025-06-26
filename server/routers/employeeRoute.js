const express = require('express');
const {
  getMe,
  updateMe,
  deleteMe,
} = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const facilityRoutes = require('./facilityRoutes');

const router = express.Router();

// Employee profile routes
router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

// Facility report routes
router.use('/facility-reports', facilityRoutes);

module.exports = router;
