const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/', authController.register)

module.exports = router;