const express = require('express');
const { getMe, updateMe, submitForm, deleteMe } = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const formidable = require('express-formidable');
const router = express.Router();

router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

router.put('/form', formidable({ multiples: true }), protect, submitForm)

module.exports = router;