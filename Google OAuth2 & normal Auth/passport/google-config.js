const passport = require("passport");
require('dotenv').config();
const googleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/google");

function initialiseGoogle(passport) {
    
    const url = `http://localhost:3000/auth/google/callback`;

    const authenticateUser = async (request, accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.find({googleId: profile.id});

            if(existingUser !== null) {
             return done(null, existingUser)
            }

            //otherwise create new user
            const user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value
            })
            await user.save();
            console.log(user.email);
           return done(null, user);
        }
        catch(err) {
          return done(err, false);
        }
      }
    
    passport.use(new googleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: url, 
        passReqToCallback: true
    },authenticateUser));

    passport.serializeUser((user,done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

}


module.exports = initialiseGoogle;