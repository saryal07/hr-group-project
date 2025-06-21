const express = require('express');
const { getMe, updateMe, deleteMe } = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

module.exports = router;