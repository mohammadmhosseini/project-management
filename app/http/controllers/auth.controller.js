const { UserModel } = require("../../models/user");
const { hashString } = require("../../modules/functions");

class AuthController{
    async register(req, res, next){
        try {
            const {username, email, mobile, password} = req.body;
        const hashedPassword = hashString(password);
        const user = await UserModel.create({
            username,
            email,
            mobile,
            password : hashedPassword
        });
        /* .catch(err => {
            if(err?.code == 11000) throw { status : 400, message: "نام کاربری تکراری است"};
        }) */
        return res.json(user);
        } catch (error) {
            next(error)
        }
    }
    login(){

    }
    resetPassword(){

    }
}

module.exports = {
    AuthController : new AuthController(),
};