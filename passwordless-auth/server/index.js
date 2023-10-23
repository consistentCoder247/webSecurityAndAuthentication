const express = require("express");
const engine = require("express-handlebars");
const authRoutes = require("./routes/auth.js");
const path = require("path")
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//configure .env file
dotenv.config();

//connect to mongoose 
mongoose.connect('mongodb://127.0.0.1:27017/passwordlessAuth');
const db = mongoose.connection;
db.once('open', () => {
    console.log("Database connected...");
})
db.on("error", (err) => {
    console.log({message: err.message})
});

const app = express();

app.use(express.static('public'));
app.engine("handlebars", engine.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/', authRoutes);

app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
})