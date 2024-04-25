const express = require('express');

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/auth/login', authController.postLogin);

router.post('/auth/logout', authController.postLogout);

router.post('/auth/signup', authController.postSignUp);

module.exports = router;