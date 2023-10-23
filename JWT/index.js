const express= require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

//parsing json from the body 
app.use(express.json());
// app.use(express.urlencoded({extended: false}));

const users = [];

app.get("/users", authenticateToken, (req,res) => {
   const user = req.user;
users.push(user);
res.json(users);

});


app.get('/', (req, res) => {
     res.json({message: "hello"});
})

// user posted the data
app.post("/login",  (req,res) => {

// 
//database main se compare karenge, agar found hai to 
// share krenge 

// user with refresh token save krna hai

});





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



app.listen(3000, ()=> {
    console.log("Server is listening on port 3000");
})