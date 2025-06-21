const express = require('express');
const router = express.Router();
const { getHousing, createHousing, updateHousing, getOnboardingStatus, updateOnboardingStatus } = require('../controllers/hrController');
const protect = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

router.use(protect);
router.use(adminOnly);

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