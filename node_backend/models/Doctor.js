const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lat: {
        type: Number
    },
    long: {
        type: Number
    },
    formattedAddress: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now()
    },
});
module.exports = mongoose.model('Doctor', doctorSchema);