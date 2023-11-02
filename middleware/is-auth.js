const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = (req, res, next) => {
    const xtoken = req.get('X-Token');
    if (!xtoken) {
        return res.status(401).json({
            status: 'failed',
            message: ['Authorization failed']
        })
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(xtoken, 'superdupersecretkey');
    } catch (e) {
        console.log(e);
    } finally {
        if (!decodedToken) {
            return res.status(401).json({
                status: 'failed',
                message: ['Authorization failed']
            })
        }
    }
    User.findById(decodedToken.userId).then(userObj => {
        req.user = userObj;
        next();
    })
}