const  mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String, 
    email: {
        type : String,
        required: true,
    } ,
    password: {
        type: String, 
        required: true,
    }
})

module.exports = new mongoose.model("User", userSchema);