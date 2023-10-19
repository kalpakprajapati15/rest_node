const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
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
            const token = jwt.sign({ email: dbUser.email, userId: dbUser.id }, 'superdupersecretkey', { expiresIn: '1h' })
            return res.status(200).json({
                status: 'Success',
                result: { email: dbUser.email, token: token },
            })
        })
    })
}
