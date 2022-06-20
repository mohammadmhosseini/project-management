const { UserModel } = require("../../models/user");
const { jwtTokenVerify } = require("../../modules/functions");

const autoLogin = async(req, res, next) => {
    try {
        let authError = { status : 401, message: "لطفا وارد حساب کاربری خود شوید"};
        const authorization = req?.headers?.authorization;
        if(!authorization) throw authError;
        const token = authorization.split(" ")?.[1];
        if(!token) throw authError;
        const payload = jwtTokenVerify(token);
        const {username} = payload;
        const user = await UserModel.findOne({username}, {password : 0, __v :0, createdAt :0, updatedAt :0});
        if(!user) throw authError;
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    autoLogin,
};