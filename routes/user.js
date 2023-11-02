const express = require('express');

const userController = require('../controllers/user');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/user/setSocketId', isAuth, userController.setSocketId);

router.get('/user/getContacts', isAuth, userController.getContacts);

router.post('/user/addContact', isAuth, userController.postContact);


module.exports = router;