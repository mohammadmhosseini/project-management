const { UserModel } = require("../../models/user");

class UserController{
    getProfile(req, res, next){
        const user = req.user;
        user.profile_image = createLinkForImages(user.profile_image, req);;
        return res.status(200).json({
            status: 200,
            success: true,
            user,
        });
    }
    async editProfile(req, res, next){
        let data = {...req.body};
        const {_id} = req.user;

        let fields = ["first_name", "last_name", "skills"];
        let badValues = ["", " ", null, undefined, -1, 0, [], {}];
        Object.entries(data).forEach(([key, value]) => {
            if(!fields.includes(key)) delete data[key];
            if(badValues.includes(value)) delete data[key];
        });

        const result = await UserModel.updateOne({_id}, {$set : data});
        if(result.modifiedCount > 0){
            return res.status(200).json({
                status : 200,
                success : true,
                message : "ویرایش پروفایل با موفقیت انجام شد"
            });
        }
        throw { status : 400, message : "ویرایش پروفایل انجام نشد"};
    }
    async uploadProfileImage(req, res, next) {
        try {
            const { _id } = req.user;
            const filePath = req.file?.path?.replace(/[\\\\]/gm, "/").substring(7);
            const result = await UserModel.updateOne({_id}, {$set : {profile_image : filePath}});
            if(result.modifiedCount == 0) throw { status : 400, message :"به روزرسانی انجام نشد"};
            return res.status(200).json({
                status : 200,
                success : true,
                message : "به روز رسانی با موفقیت انجام شد"
            });
        } catch (error) {
            next(error)
        }
    }
    addSkills(){

    }
    editSkills(){
        
    }
    acceptInvitationOfTeam(){

    }
    rejectInvitationOfTeam(){

    }
}

module.exports= {
    UserController : new UserController(),
};