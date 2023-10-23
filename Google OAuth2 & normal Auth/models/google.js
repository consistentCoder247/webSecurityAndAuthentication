const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true
      },
});

module.exports = new mongoose.model("GoogleUser", googleUserSchema);