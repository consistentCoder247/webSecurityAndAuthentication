const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const generateToken  = require('../utils/jwt.js');
const jwt =require('jsonwebtoken');
require("dotenv").config();
const {authenticator, totp} = require("otplib");
var readlineSync = require('readline-sync');
const User = require("../models/auth.js");
const mobileUser = require('../models/mobile.js')
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


const secret = authenticator.generateSecret();
//otp
const token = totp.generate(secret);
console.log(token, secret);
let isValidOtp = authenticator.verify({
token: token,
secret: secret
})


// const otp = readlineSync.question('Enter your otp: ');

    

const transportOptions = {
    host: process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASSWORD
    }
    };
    
const transporter = nodemailer.createTransport(transportOptions);
console.log(transporter.options)
const emailHtmlTemplate = ({email, otp}) => `
<p> <b> Dear ${email} </b></p>  
<p> type the otp to login: ${otp}</p>
 `;

 const smsTemplate = (otp) => {
    return `\n Type the otp to login: ${otp}`
 }

router.get('/account', (req,res) => {
    // taking token query parameter from the request 
    const {token} = req.query;
    if(!token) {
        res.status(403).send({
            message: "No token found",
        })
    }
    
    let user;
    try {
     user = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err){
 res.status(403).send({message: err.message})
    }

    if(!user) {
        res.status(403)
        .send({
            message: "Token signature invalid"
        })
     }
     else {
        const {email, expirationDate} = user;
        if(!email || !expirationDate) {
            res.status(403)
            .send({
                message: " invalid user credentials => email and expirationDate not found"
            })
        }

        if(expirationDate < new Date()) {
            res.status(403)
            .send({
                message: "token expired"
            })
        };

        res.status(200).send("user is validated")
     }
})

let accessToken;
router.post("/login/otp",  async (req, res)=>{
   
    const {otp} = req.body;
    if(otp == null) {
        res.sendStatus(403);
    }
    try {
        const user = await User.find({accessToken: accessToken});   
        if( user == null) {
            res.status(401).send({message: "User unauthorized"});
        }
        else {

            if(user[0].otp == otp) {
                res.redirect(`/account?token=${accessToken}`);
            }
            else {
                res.status(401).send({message: "otp does not match"})
            }

           
       
        }
      
    }
    catch(err) {
        console.log(err);
    }
})

router.post('login/mobile', async (req, res) => {
    const phoneNo = req.body.phone;
    if(phoneNo == null) {
        res.sendStatus(403);
    }

    const user = new mobileUser(
        {
            body: smsTemplate(token),
            to: phoneNo,
        }
    );

        try {
const newUser = await user.save();
res.status(201).send(user);
        }
        catch(err) {
res.send({message: err.message})
        }
    
    
client.messages
.create(user)
.then((message) => {
    console.log(message.body);
    accessToken = message.sid;
    res.redirect('/login/otp');
})
.done();

})

router.post("/login/email",  async (req, res) => {
    const email = req.body.email;
    console.log(email);
   
    if(!email) {
        res.sendStatus(404);
    }


//get token

  accessToken = generateToken(email);

  // add user to database
const newUser = new User({
    email,
    accessToken,
    otp: token,
})

try {
const user = await newUser.save();

//new user created
res.status(201).send(user);
}

catch (err) {
res.send({message: err.message})
}

 const mailOptions = {
    from: "donotreply",
    to: email,
    subject: "Login using the magic link",
    html : emailHtmlTemplate({
       email,
       otp:  token,
    })
};

return  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      res.send({message: error.message});
    } else {
      res.status(200);
      res.write(`otp sent to ${email}`)
    }
  });
});





  



module.exports = router;