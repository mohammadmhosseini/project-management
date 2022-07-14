const path = require("path");
const { createUploadPath } = require("./functions");

const uploadFile = async(req, res, next) => {
    try {
        if(!req.files || Object.keys(req.files).length == 0) throw { status : 400, message : "لطفا یک تصویر را برای پروژه انتخاب کنید"}; 
        const image = req.files?.image;
        const type = path.extname(image?.name);
        if(![".jpg", ".png", ".jpeg", ".webp", ".gif"].includes(type)) throw { status : 400, message : "فرمت تصویر ارسالی نادرست است"};
        const imagePath = path.join(createUploadPath(), (Date.now() + type));
        req.body.image = imagePath.replace(/[\\\\]/gm, "/").substring(7);
        const uploadPath = path.join(__dirname, "..","..", imagePath);
        image.mv(uploadPath, (err => {
            if(err) throw { status : 500, message :"بارگذاری تصویر انجام نشد"};
            next();
        }))
    } catch (error) {
       next(error) 
    }
}

module.exports = {
    uploadFile,
};