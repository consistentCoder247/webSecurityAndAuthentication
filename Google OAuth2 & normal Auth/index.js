const express = require("express");
const app = express();
const dotenv = require("dotenv");
if(process.env.NODE_ENV !== "production"){
    dotenv.config();
}
const router = require("./routes/auth");
const passport = require("passport");
const initialisePassport = require("./passport/passport-config");
const initialiseOAuth = require("./passport/google-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
// importing and connecting mongoose to connection string
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING);
const db = mongoose.connection;
db.on("error", (err) => {
    console.log("Database disconnected");
})
db.once("open", () => {
    console.log("Database Connected");
})

//mongoose models 
const User = require("./models/auth");




// accepting json and form input 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//handlebars templating library
const engine = require("express-handlebars");
app.engine("handlebars", engine.engine());
app.set("view engine", "handlebars");
app.set("views","./views");

//initialise passport and sessions

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//initialise passport as session
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
initialisePassport(passport);
initialiseOAuth(passport);

// routes 
app.use("/", router);

//starting listening to express app on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
