const express= require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();


//parsing json from the body 
app.use(express.json());
// app.use(express.urlencoded({extended: false}));



app.post("/register",   (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    // console.log(username, password);

const user = {
    username: username,
    password: password,
}
try {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    //201 => new token created
    res.status(201).json({accessToken: accessToken, refreshToken: refreshToken});
    // res.redirect('/login');
}   
catch(err) {
    res.json({message: err.message})
}

});

const refreshTokens= [];
app.post('/token', (req, res) => {
    const token = req.body.token;
    console.log(token);
    // if(token == null) res.status(401).send();
    // if(!refreshTokens.includes(token)) res.status(403).send();
jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
    // if(err) {
    //     // invalid token
    //     res.status(403).send({message: err.message});
    // }
    
})
})


function authenticateToken (req, res, next) {
    // token in authorization header
    const authHeader = req.headers.authorization;
 
    // Authorization: "Bearer <token>"
    if(authHeader == null) {
        res.json({message: "No authorization Header found, register first"});
    }
    const token = authHeader && authHeader.split(" ")[1];
// if no token found => user not authenticated 
if(token == null){
    res.status(401).send();
}

   // verify the token and obtain the user
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) {
        // invalid token
        res.status(403).send({message: err.message});
    }
    req.user= user;
});
 
next();
}



app.listen(4000, ()=> {
    console.log("Server is listening on port 4000");
})