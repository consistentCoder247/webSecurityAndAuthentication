const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const app = express();
const User = require("../models/auth");
const googleUser = require("../models/google");
const passport = require("passport");


router.get("/", checkAuthenticate, (req,res) =>{
    
   
    if(req.user.displayName == null){
        res.render("home", {name: req.user.name});
    }
    else {
        res.render("home", {name: req.user.displayName});
    }
})

router.get("/login", checkNotAuthenticated,(req,res) =>{
    res.render("login");
})

router.get("/register", checkNotAuthenticated, (req,res) =>{
    res.render("register");
})

router.get("/users/google", async (req,res) => {
    try{
const users = await googleUser.find();
res.status(200).json(users);
    }
    catch(err) {
       res.status(500).json({message: err.message});
    }
})

router.get("/users", async (req,res) => {
    try{
const users = await User.find();
res.status(200).json(users);
    }
    catch(err) {
       res.status(500).json({message: err.message});
    }
})

router.post("/register", checkNotAuthenticated, async (req,res) =>{
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
   const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
   });
   try {
    const newUser = await user.save();
    res.status(201).redirect("/login");
   }
   catch (err){

    res.redirect("/register");
   }

});


router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.delete('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

  //google routes
  router.get("/auth/google", passport.authenticate('google',{scope: ['email','profile']}));

  router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect : "/",
    failureRedirect: "/register",
  }));

function checkAuthenticate(req, res, next) {
    if(req.isAuthenticated()){
        next();
    }
    else {
        // not authenticated 
       return res.redirect("/login");
    }
}

function checkNotAuthenticated(req, res, next ) {
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
   
        // not authenticated 
        next();
    
}
module.exports = router;