const express = require('express');
const { 
  getMe, 
  updateMe, 
  deleteMe 
} = require('../controllers/employeeController');
const { 
  getMyHousing, 
  getMyFacilityReports, 
  createFacilityReport, 
  addCommentToReport 
} = require('../controllers/employeeHousingController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

// Housing routes
router.route('/housing/me')
  .get(protect, getMyHousing);

// Facility reports routes
router.route('/facility-reports/me')
  .get(protect, getMyFacilityReports);

router.route('/facility-reports')
  .post(protect, createFacilityReport);

router.route('/facility-reports/:id/comments')
  .post(protect, addCommentToReport);

module.exports = router;