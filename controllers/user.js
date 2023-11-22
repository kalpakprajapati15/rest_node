const User = require('../models/user')

exports.setSocketId = (req, res, next) => {
    const socketId = req.body.socketId;
    const userObj = req.user;
    userObj.socketId = socketId;
    userObj.save().then(savedRes => {
        return res.status(201).json({
            result: savedRes,
            status: 'Success'
        })
    })
}

exports.getContacts = (req, res, next) => {
    const user = req.user;

    user.populate('contacts.userId').then(userPopulated => {
        let contacts = userPopulated.contacts.map((oval) => {
            return {
                name: oval.userId.name,
                email: oval.userId.email,
                _id: oval.userId._id.toString()
            }
        })
        return res.status(200).json({
            status: 'Success',
            result: { contacts }
        })
    })
}

exports.postContact = (req, res, next) => {
    const user = req.user;
    const contactEmail = req.body.email;

    User.findOne({ email: contactEmail }).then(contact => {
        if (!contact) {
            return res.status(401).json({
                status: 'failed',
                message: ['User doesnt exist']
            })
        }
        if (user.contacts.find(oval => oval.userId.toString() === contact._id.toString())) {
            return res.status(401).json({
                status: 'failed',
                message: ['Contact already exists']
            })
        }
        if (user.contacts.find(oval => oval.userId.toString() === user._id.toString())) {
            return res.status(401).json({
                status: 'failed',
                message: ['Cannot add self as a contact']
            })
        }
        user.contacts.push({ userId: contact._id });
        contact.contacts.push({ userId: user._id });
        Promise.all([user.save(), contact.save()]).then(([userSave, contactSave]) => {
            let io;
            try {
                io = require('../socket').getIO();
            } catch (e) {
                console.log(e);
            }
            console.log(io, "id", contact.socketId);
            if (io) {
                io.to(contact.socketId).emit('Contact Added', true);
            }
            return res.status(201).json({
                result: userSave,
                status: 'Success'
            })
        })
    })
}