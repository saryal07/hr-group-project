const express = require('express');
const router = express.Router();
const {
  createRegistrationToken, 
  getHousing, 
  createHousing, 
  updateHousing, 
  getOnboardingStatus, 
  updateOnboardingStatus,
  getAllDocuments,
  getPendingDocuments,
  getEmployeeDocuments,
  approveDocument,
  rejectDocument,
  getOptEmployees,
  getWorkflowSummary
} = require('../controllers/hrController');
const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect);
console.log('Admin middleware:', adminMiddleware);
router.use(adminMiddleware); // to ensure only admin has access to these

// Sending Tokenized registration link
router.route('/invite')
  .post(createRegistrationToken);

// Housing routes
router.route('/housing')
  .get(getHousing)
  .post(createHousing)
  .put(updateHousing); // approach that is currently being used is to update by ID

// Onboarding
router.route('/onboarding/:employeeId')
  .get(getOnboardingStatus)
  .put(updateOnboardingStatus);

// Document management routes
router.route('/documents')
  .get(getAllDocuments);

router.route('/documents/pending')
  .get(getPendingDocuments);

router.route('/documents/employee/:employeeId')
  .get(getEmployeeDocuments);

router.route('/documents/:id/approve')
  .put(approveDocument);

router.route('/documents/:id/reject')
  .put(rejectDocument);

// OPT employee management
router.route('/employees/opt')
  .get(getOptEmployees);

router.route('/workflow-summary')
  .get(getWorkflowSummary);

module.exports = router;