const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const socketId = req.body.socketId;
    User.findOne({ email: email }).then((dbUser) => {
        if (!dbUser) {
            return res.status(401).json({
                status: 'Failed',
                result: [],
                message: ['User does not exist with this email']
            })
        }
        bcrypt.compare(password, dbUser.password).then(match => {
            if (!match) {
                return res.status(200).json({
                    status: 'Failed',
                    result: [],
                    message: ['Password is not correct']
                })
            }
            const token = jwt.sign({ email: dbUser.email, userId: dbUser.id }, 'superdupersecretkey', { expiresIn: '6h' })
            dbUser.socketId = socketId;
            dbUser.save().then(() => {
                return res.status(200).json({
                    status: 'Success',
                    result: { email: dbUser.email, token: token, name: dbUser.name, user: dbUser },
                })
            })
        })
    })
}

exports.postLogout = (req, res, next) => {
    const email = req.body.email;
    User.findOne({ email: email }).then(dbUser => {
        dbUser.socketId = null;
        dbUser.save().then(() => {
            return res.status(200).json({
                status: 'Success',
                result: {},
            })
        })
    })
}
