const express = require('express');

const messageController = require('../controllers/message');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/message', isAuth, messageController.getMessages)

module.exports = router;