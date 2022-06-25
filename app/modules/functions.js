const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

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

function createUploadPath(){
    const d = new Date();
    const year = ""+d.getFullYear();
    const month = ""+(d.getMonth()+1);
    const day = ""+d.getDate();
    const uploadPath = path.join(__dirname, "..","..","public","uploads","images", year, month, day);
    fs.mkdirSync(uploadPath, {recursive : true});
    return path.join("public","uploads","images", year, month, day);
}

function createLinkForImages(fileAddress, req){
    return fileAddress ? req.protocol + "://" + req.get("host") + "/" + fileAddress : "بدون عکس"
}

module.exports = {
    hashString,
    jwtTokenGenerator,
    jwtTokenVerify,
    createUploadPath,
    createLinkForImages
};