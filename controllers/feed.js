const Post = require('../models/post');
const User = require('../models/user')
const io = require('../socket');
exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            result: posts
        });
    })
}

exports.getSinglePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findOne({ _id: postId }).then(post => {
        res.status(200).json({
            result: post
        })
    })
}

exports.savePost = (req, res, next) => {
    const id = req.body._id;
    if (id) { // update
        Post.updateOne({ _id: id }, { $set: { title: req.body.title, content: req.body.content } }).then(response => {
            res.status(201).json({
                result: response,
                status: 'Success'
            })
        });
    } else { // create
        const createdByMail = req.body.createdBy;
        User.findOne({
            email: createdByMail
        }).then(user => {
            if (!user) {
                return res.status(401).json({
                    status: 'failed',
                    message: ['User doesnt exist']
                })
            }
            const post = new Post({ title: req.body.title, content: req.body.content, createdBy: { name: user.name } });
            io.getIO().emit('Created Post', post);
            console.log(io.getIO())
            post.save().then(postObj => {
                res.status(201).json({
                    result: postObj,
                    status: 'Success'
                })
            })
        })
    }
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.deleteOne({ _id: postId }).then(response => {
        res.status(200).json({
            result: [],
            status: 'Success'
        })
    })
}

