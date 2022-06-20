const {body} = require("express-validator");
const path = require("path");

function imageValidator(){
    return [
        body("image").custom((value, {req}) => {
            console.log(req.file);
            const exts = [".jpg",".png",".jpeg",".gif"];
            const maxSize = 5 * 1024 * 1024;
            if(Object.keys(req.file).length == 0) throw "لطفا یک تصویر را انتخاب کنید";
            const fileExt = path.extname(req.file.originalname);
            if(!exts.includes(fileExt)) throw "فرمت تصویر ارسالی صحیح نیست";
            if(req.file.size > maxSize) throw "حجم فایل نمیتواند از 5 مگابایت بیشتر باشد";
            return true;
        })
    ];
}

module.exports = {
    imageValidator,
};