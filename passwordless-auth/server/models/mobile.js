const mongoose = require("mongoose");
require('dotenv').config();

const mobileSchema = new mongoose.Schema({
    from : {
        type: String,
        required: true, 
        default: process.env.TWILIO_NO
    },
    to : {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
});

module.exports = new mongoose.model("MobileUser", mobileSchema);