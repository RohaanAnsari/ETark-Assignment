const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  res.status(200).json({ message: 'signup' });
});

module.exports = router;
