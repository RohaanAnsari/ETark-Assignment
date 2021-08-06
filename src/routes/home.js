const express = require('express');
const { requireSignin } = require('../common-middleware');
const router = express.Router();
const { demo } = require('../controllers/home');

router.get('/home', requireSignin, demo);

module.exports = router;
