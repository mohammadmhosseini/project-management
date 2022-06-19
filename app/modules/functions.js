const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashString(data){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
}

function jwtTokenGenerator(payload){
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : "3 days"});
    return token;
}

module.exports = {
    hashString,
    jwtTokenGenerator,
};