const path = require("path");
const { createUploadPath } = require("./functions");

const uploadFile = async(req, res, next) => {
    try {
        if(!req.files || Object.keys(req.files).length == 0) throw { status : 400, message : "لطفا یک تصویر را برای پروژه انتخاب کنید"}; 
        const image = req.files?.image;
        const imagePath = createUploadPath() + (Date.now() + path.extname(image?.name));
        req.body.image = imagePath.replace(/[\\\\]/gm, "/");
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