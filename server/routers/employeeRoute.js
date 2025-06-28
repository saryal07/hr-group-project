const express = require('express');
const {
  getMe,
  updateMe,
  submitForm,
  deleteMe,
} = require('../controllers/employeeController');
const {
  getMyHousing,
  getMyFacilityReports,
  createFacilityReport,
  addCommentToReport,
} = require('../controllers/employeeHousingController');

const { protect } = require('../middlewares/authMiddleware');
const formidable = require('express-formidable');
const router = express.Router();
const facilityRoutes = require('./facilityRoutes');

router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

router.put('/form', formidable({ multiples: true }), protect, submitForm);

// Housing routes
router.route('/housing/me').get(protect, getMyHousing);

// Facility report routes
router.use('/facility-reports', facilityRoutes);

module.exports = router;
