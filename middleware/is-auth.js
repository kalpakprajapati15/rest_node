const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const xtoken = req.get('X-Token');
    if (!xtoken) {
        return res.status(401).json({
            status: 'failed',
            message: ['Authorization failed']
        })
    }
    const decodedToken = jwt.verify(xtoken, 'superdupersecretkey');
    if (!decodedToken) {
        return res.status(401).json({
            status: 'failed',
            message: ['Authorization failed']
        })
    }
    req.userId = decodedToken.userId;
    next();
}