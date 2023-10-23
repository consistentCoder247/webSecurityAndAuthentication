const jwt = require('jsonwebtoken');

const generateToken = (email)=> {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 1);
    let accessToken;
try {

     accessToken = jwt.sign({email, expirationDate},process.env.JWT_SECRET);
}
catch(err) {
 console.log("error in signing the jwt");
}

return accessToken;
}

module.exports = generateToken;