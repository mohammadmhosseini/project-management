const multer = require("multer");
const path = require("path");
const { createUploadPath } = require("./functions");

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, createUploadPath());
    },
    filename : (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
})
const upload_multer = multer({storage});

module.exports = {
    upload_multer,
};