const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    fromUsername: {
        type: String,
        required: true
    },
    toUsername: {
        type: String,
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    date_time: {
        type: Date,
        default: Date.now()
    },
});
module.exports = mongoose.model('Requests', requestSchema);
