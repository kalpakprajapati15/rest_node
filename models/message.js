const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: String,
    fromId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    toId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);