const { UserModel } = require("../../models/user");
const { TeamModel } = require("../../models/team");
const { createLinkForImages } = require("../../modules/functions");
var mongoose = require('mongoose');

class UserController{
    getProfile(req, res, next){
        const user = req.user;
        user.profile_image = createLinkForImages(user.profile_image, req);
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
    async getAllInviteRequests(req, res, next){
        try {
            const userId = req.user._id;
            const {inviteRequests} = await UserModel.findById({_id : userId});
            return res.json({
                requests : inviteRequests || []
            })
        } catch (error) {
            next(error)
        }
    }
    async getRequestsByStatus(req, res, next){
        try {
            const userId = req.user._id;
            const {status} = req.params;
            const requests = await UserModel.aggregate([
                {
                    $match : {_id : userId}
                },
                {
                    $project : {
                        _id: 0,
                        inviteRequests : 1,
                        inviteRequests : {
                            $filter : {
                                input : "$inviteRequests",
                                as : "request",
                                cond : {
                                    $eq : ["$$request.status", status]
                                }
                            }
                        }
                    }
                }
            ]);
            return res.status(200).json({
                status : 200,
                message : true,
                requests : requests?.[0]?.inviteRequests || []
            }); 
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    addSkills(){

    }
    editSkills(){
        
    }
    async changeRequestStatus(req, res, next){
        try {
            const userId = req.user._id;
            const { id, status } = req.params;
             
            // first way to find request
            const request = await UserModel.findOne({"inviteRequests._id" : id});

            /* second way with better performance  */
            /* const request = await UserModel.aggregate([
                {
                    $match : {_id : userId}
                },
                {
                    $project : {
                        _id: 0,
                        inviteRequests : 1,
                        inviteRequests : {
                            $filter : {
                                input : "$inviteRequests",
                                as : "request",
                                cond : {
                                    $eq : ["$$request._id", mongoose.Types.ObjectId(id)]
                                }
                            }
                        }
                    }
                }
            ]);  */
            if(!request) throw { status : 404, message : "درخواستی یافت نشد"};
            /* const findRequest = request?.[0].inviteRequests?.[0]; */
            const findRequest = request.inviteRequests.find(item => item._id == id);
            if(findRequest.status !== "pending") throw { status : 400, message: "درخواست قبلا رد یا پذیرفته شده است"};
            if(!["accepted", "rejected"].includes(status)) throw { status : 400, message : "مشخصات ارسال شده صحیح نمیباشد"};
            const result = await UserModel.updateOne({"inviteRequests._id" : id}, { 
                $set : {"inviteRequests.$.status" : status}
            });
            if(result.modifiedCount == 0) throw { status : 500, messaeg : "تغییر وضعیت درخواست انجام نشد"};
            const teamId = findRequest.teamId;
            const addToTeamResult = await TeamModel.updateOne({_id : teamId}, {
                $push : {users : userId}
            });
            if(addToTeamResult.modifiedCount == 0) throw { status : 500, message : "افزودن کاربر به تیم با خطا مواجه شد"};
            return res.status(200).json({
                status : 200,
                success: true,
                message : "تغییر وضعیت درخواست با موفقیت انجام شد و کاربر به تیم افزوده شد"
            });
        } catch (error) {
            next(error)
        }
    }
    rejectInvitationOfTeam(){

    }
}

module.exports= {
    UserController : new UserController(),
};