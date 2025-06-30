const express = require('express');
const router = express.Router();
const {
  createRegistrationToken,
  getHousing,
  createHousing,
  updateHousing,
  updateHousingById,
  deleteHousing,
  getOnboardingStatus,
  updateOnboardingStatus,
  getAllDocuments,
  getPendingDocuments,
  getEmployeeDocuments,
  approveDocument,
  rejectDocument,
  getOptEmployees,
  getWorkflowSummary,
  getInviteHistory,
  getSpecificOnboarding,
  getAllEmployees,
  getEmployeeById
} = require('../controllers/hrController');
const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect);
console.log('Admin middleware:', adminMiddleware);
router.use(adminMiddleware);

// Sending Tokenized registration link
router.route('/invite')
  .post(createRegistrationToken)
  
router.route('/invite-history').get(getInviteHistory);

router.route('/onboarding').get(getSpecificOnboarding);

// Housing routes
router.route('/housing').get(getHousing).post(createHousing).put(updateHousing);

// Individual housing operations with ID in URL
router
  .route('/housing/:id')
  .put(updateHousingById) // PUT /api/hr/housing/:id
  .delete(deleteHousing); // DELETE /api/hr/housing/:id

// Onboarding
router
  .route('/onboarding/:employeeId')
  .get(getOnboardingStatus)
  .put(updateOnboardingStatus);

// Document management routes
router.route('/documents').get(getAllDocuments);

router.route('/documents/pending').get(getPendingDocuments);

router.route('/documents/employee/:employeeId').get(getEmployeeDocuments);

router.route('/documents/:id/approve').put(approveDocument);

router.route('/documents/:id/reject').put(rejectDocument);

// Employee management routes
router.route('/employees')
  .get(getAllEmployees);

// OPT employee management - moved before parameterized route
router.route('/employees/opt')
  .get(getOptEmployees);

router.route('/employees/:id')
  .get(getEmployeeById);

router.route('/workflow-summary')
  .get(getWorkflowSummary);

module.exports = router;
