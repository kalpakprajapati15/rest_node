const express = require('express');
const feedController = require('../controllers/feed');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/post/fetch', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth, feedController.getSinglePost);

router.post('/post', isAuth, feedController.savePost);

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;