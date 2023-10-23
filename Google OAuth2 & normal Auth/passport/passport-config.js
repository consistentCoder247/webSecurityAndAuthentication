const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt")
const User = require("../models/auth");

function initialisePassport(passport) {
    async function authenticateUser(email, password, done) {
        const user = await User.findOne({email: email});
        if(user == null) {
            //USER NOT FOUND
            //done(error, user or false, message in json);
            return done(null,false, {message: "not user with that email"});
        }
        try {
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) throw error;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password entered is incorrect.' });
                }
            });
        }

        catch(error) {
    return done(error);
        }
    }

//setup local strategy;
passport.use(new localStrategy({usernameField: "email"}, authenticateUser));

//add user to session 
passport.serializeUser((user, done) => done(null, user.id));

//remove user from session
passport.deserializeUser( async (id, done) => {
const user = await User.findById(id);
return done(null, user);
})
}


module.exports = initialisePassport;