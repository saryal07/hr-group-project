const express = require('express');
const router = express.Router();
const { getHousing, createHousing, updateHousing, getOnboardingStatus, updateOnboardingStatus } = require('../controllers/hrController');
const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect);
console.log('Admin middleware:', adminMiddleware);
router.use(adminMiddleware); // ensure only admin has access to these

// Housing routes
router.route('/housing')
  .get(getHousing)
  .post(createHousing)
  .put(updateHousing); // approach that is currently being used is to update by ID

// Onboarding
router.route('/onboarding/:employeeId')
  .get(getOnboardingStatus)
  .put(updateOnboardingStatus);

module.exports = router;