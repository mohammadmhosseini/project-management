const {body} = require("express-validator");

function createProjectValidator(){
    return [
        body("title").notEmpty().withMessage("لطفا عنوان پروژه را وارد کنید"),
        body("text").notEmpty().isLength({min : 20}).withMessage("لطفا توضیحات پروژه را وارد کنید و توضیحات باید حداقل 20 کاراکتر باشد"),
    ];
}

module.exports = {
    createProjectValidator,
};