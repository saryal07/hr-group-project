const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createFacilityReport,
  getFacilityReports,
  getFacilityReport,
  updateFacilityReport,
  deleteFacilityReport,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/facilityController');

// Apply authentication middleware to all routes
router.use(protect);

// Facility Report Routes
router
  .route('/')
  .get(getFacilityReports) // GET /api/employee/facility-reports
  .post(createFacilityReport); // POST /api/employee/facility-reports

router
  .route('/:id')
  .get(getFacilityReport) // GET /api/employee/facility-reports/:id
  .put(updateFacilityReport) // PUT /api/employee/facility-reports/:id
  .delete(deleteFacilityReport); // DELETE /api/employee/facility-reports/:id

// Comment Routes
router.route('/:id/comments').post(addComment); // POST /api/employee/facility-reports/:id/comments

router
  .route('/:reportId/comments/:commentId')
  .put(updateComment) // PUT /api/employee/facility-reports/:reportId/comments/:commentId
  .delete(deleteComment); // DELETE /api/employee/facility-reports/:reportId/comments/:commentId

module.exports = router;
