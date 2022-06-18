const {body} = require("express-validator");
const { UserModel } = require("../../models/user");

function registerValidator(){
    return [
        body("username").custom(async(value, context) => {
            if(value){
                const usernameRegex = /^[a-z]+[a-z0-9\.\_]{3,}/gi
                if(usernameRegex.test(value)){
                    const user = await UserModel.findOne({username : value});
                    if(user) throw "نام کاربری وارد شده تکراری میباشد";
                    return true;
                }
                throw "فرمت نام کاربری صحیح نمیباشد";
            }
            throw "لطفا نام کاربری را وارد کنید";
        }),
        body("email").isEmail().withMessage("فرمت ایمیل صحیح نمیباشد").custom(async email => {
            const user = await UserModel.findOne({email});
            if(user) throw "ایمیل وارد شده تکراری میباشد";
            return true;
        }),
        body("mobile").isMobilePhone("fa-IR").withMessage("فرمت موبایل صحیح نمیباشد")
        .custom(async mobile => {
            const user = await UserModel.findOne({mobile});
            if(user) throw "موبایل وارد شده تکراری میباشد";
            return true;
        }),
        body("password").isLength({min : 6, max : 16}).withMessage("رمز عبور باید بین 6 و 16 کاراکتر باشد")
        .custom((value, context) => {
            if(!value) throw "رمز عبور نمیتواند خالی باشد";
            if(value !== context?.req?.body?.confirmPassword) throw "رمز عبور با تکرار آن یکسان نیست";
            return true;
        })
    ];
}

module.exports = {
    registerValidator,
};