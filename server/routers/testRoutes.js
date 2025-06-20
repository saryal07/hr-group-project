const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running...' });
});

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test route working' });
});

module.exports = router;