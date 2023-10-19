const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: { name: String },
    }
}, { timestamps: true });

module.exports = mongoose.model('Posts', postSchema);