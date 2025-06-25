const express = require('express');
const router = express.Router();
const { registerEmployee, loginEmployee, checkRegistrationToken } = require('../controllers/authController');

router.get('/token/:token', checkRegistrationToken);
router.post('/register/:token', registerEmployee);
router.post('/login', loginEmployee);

module.exports = router;