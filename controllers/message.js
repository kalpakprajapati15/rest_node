const message = require('../models/message');
const Message = require('../models/message');
const User = require('../models/user')

exports.watchMessage = (socket) => {
    if (!socket) {
        throw new Error('socket not initialized');
    }
    socket.on('Client Message', (clientMessage) => {
        User.findOne({ _id: clientMessage.fromId }).then(userObj => {
            if (userObj) {
                this.handleMessage(socket, clientMessage, userObj);
            }
        })
    })
}

this.handleMessage = (socket, clientMessage, fromUser) => {
    User.findOne({ _id: clientMessage.toId }).then(toUser => {
        if (fromUser && toUser) {
            const message = new Message({ text: clientMessage.text, toId: toUser._id, fromId: fromUser._id });
            socket.to(toUser.socketId).emit('Client Get Message', clientMessage)
            message.save().then(messageObj => {
                console.log(messageObj);
            })
        }
    })
}

exports.getMessages = (req, res, next) => {
    const user = req.user;
    const fromId = req.query.fromId;
    Message.find().or([{ $and: [{ fromId: fromId }, { toId: user._id }] },
                       { $and: [{ fromId: user._id }, { toId: fromId }] }]).
                       sort({ $natural: 1 }).limit(10).exec().then(messages => {
        return res.status(200).json({
            result: messages,
            status: 'Success'
        })
    })
}



