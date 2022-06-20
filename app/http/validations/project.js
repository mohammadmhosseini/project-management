const {body} = require("express-validator");

function createProjectValidator(){
    return [
        body("title").notEmpty().withMessage("لطفا عنوان پروژه را وارد کنید"),
        body("text").notEmpty().isLength({min : 20}).withMessage("لطفا توضیحات پروژه را وارد کنید و توضیحات باید حداقل 20 کاراکتر باشد"),
        body("tags").isArray({min : 0, max : 10}).withMessage("حداکثر از 10 هشتگ میتوانید استفاده کنید")
    ];
}

module.exports = {
    createProjectValidator,
};