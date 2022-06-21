const { param } = require("express-validator");

function mongoIdValidator(){
    return [
        param("id").isMongoId().withMessage("فرمت شناسه ارسال شده صحیح نمیباشد")
    ];
}

module.exports = {
    mongoIdValidator,
};