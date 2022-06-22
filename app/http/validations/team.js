const {body} = require("express-validator");
const { TeamModel } = require("../../models/team");

function createTeamValidator(){
    return [
        body("name").isLength({min : 5}).withMessage("نام تیم نمیتواند از 5 نویسه کمتر باشد"),
        body("description").notEmpty().withMessage("توضیحات تیم نمیتواند خالی باشد"),
        body("username").custom(async(username) => {
            if(username){
                const usernameRegex = /^[a-z]+[a-z0-9\.\_]{3,}$/gim
                if(usernameRegex.test(username)){
                    const team = await TeamModel.findOne({username});
                    if(team) throw "نام کاربری قبلا توسط تیم دیگری استفاده شده است";
                    return true;
                }
                throw "فرمت نام کاربری صحیح نیست";
            }
            throw "نام کاربری تیم نمیتواند خالی باشد";
        })
    ];
}

module.exports = {
    createTeamValidator,
};