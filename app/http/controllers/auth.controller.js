const { UserModel } = require("../../models/user");
const { hashString, jwtTokenGenerator } = require("../../modules/functions");
const bcrypt = require("bcrypt");

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
            })
            .catch(err => {
                /* if(err?.code == 11000) throw { status : 400, message: "نام کاربری تکراری است"}; */
                if(err) return res.status(400).json({ status : 400, message :"ثبت نام با خطا مواجه شد"});
            });
            return res.status(201).json({
                status : 201,
                success : true,
                message:
            "ثبت نام شما با موفقیت انجام شد لطفا از بخش ورود وارد حساب کاربری خود شوید",
            });
        } catch (error) {
            next(error)
        }
    }
    async login(req, res, next){
        try {
            const {username, password} = req.body;
            const user = await UserModel.findOne({username});
            if(!user) throw { status : 401, message : "نام کاربری یا رمز عبور نادرست است"};
            if(!bcrypt.compareSync(password, user.password)) throw { status : 401, message : "نام کاربری یا رمز عبور نادرست است"};
            const token = jwtTokenGenerator({username});
            user.token = token;
            user.save();

            return res.status(200).json({
                status : 200,
                success : true,
                message : "با موفقیت وارد حساب کاربری خود شدید",
                token
            });
        } catch (error) {
            next(error);
        }
    }
    resetPassword(){

    }
}

module.exports = {
    AuthController : new AuthController(),
};