const jwt = require("jsonwebtoken");

const generateAccessToken = (data) => {
    console.log(process.env.ACCESS_TOKEN_SECRET, "process.env.ACCESS_TOKEN_SECRET")
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
}
module.exports =  generateAccessToken