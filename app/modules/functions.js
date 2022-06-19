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

function jwtTokenVerify(token){
    try {
        const result = jwt.verify(token, process.env.SECRET_KEY);
        if(!result?.username) throw { status :401, message : "لطفا وارد حساب کاربری خود شوید"};
        return result;
    } catch (error) {
        throw {
            status : 401,
            success : false,
            message : "ورود به حساب کاربری انجام نشد لطفا مجددا وارد شوید"
        }
    }
}

module.exports = {
    hashString,
    jwtTokenGenerator,
    jwtTokenVerify,
};