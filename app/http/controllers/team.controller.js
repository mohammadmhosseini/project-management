const { TeamModel } = require("../../models/team");
const { UserModel } = require("../../models/user");
const autoBind = require("auto-bind");

class TeamController{
    constructor(){
        autoBind(this);
    }
    async createTeam(req, res, next){
        try {
            const {name, description, username} = req.body;
            const owner = req.user._id;
            const result = await TeamModel.create({
                name,
                description,
                username,
                owner
            });
            if(!result) throw {status : 500, message: "ایجاد تیم با مشکل مواجه شد"};
            return res.status(201).json({
                status : 201,
                success : true,
                message : "تیم جدید با موفقیت ایجاد شد"
            });
        } catch (error) {
           next(error) 
        }
    }
    async getListOfTeams(req, res, next){
        try {
            const teams = await TeamModel.find({});
            return res.status(200).json({
                status : 200,
                success: true,
                teams
            });
        } catch (error) {
            next(error)
        }
    }
    async getTeamById(req, res, next){
        try {
            const teamId = req.params.id;
            const team = await TeamModel.findOne({teamId});
            if(!team) throw {status : 404, message : "تیمی یافت نشد"};
            return res.status(200).json({
                status : 200,
                success : true,
                team
            });
        } catch (error) {
            next(error)
        }
    }
    async getMyTeams(req, res, next){
        try {
            const userId = req.user._id;
            const myTeams = await TeamModel.aggregate([
                {
                    $match : {
                        $or : [
                            {owner : userId},
                            {users : userId}
                        ]
                    }
                },
                {
                    $lookup : {
                        from : "users",
                        localField : "owner",
                        foreignField : "_id",
                        as : "owner"
                    },
                },
                {
                    $lookup : {
                        from : "users",
                        localField : "users",
                        foreignField : "_id",
                        as : "users"
                    }
                },
                {
                    $project : {
                        "name" : 1,
                        "description" : 1,
                        "username" : 1,
                        "users.username" : 1,
                        "users.email" : 1,
                        "users.mobile" : 1,
                        "owner.username" : 1,
                        "owner.email" : 1,
                        "owner.mobile" : 1
                    }
                },
                {
                    $unwind : "$owner"
                },               
                {
                    $unwind : "$users"
                }               
            ])
            if(!myTeams) throw { status : 404, message : "تیمی یافت نشد"};
            return res.status(200).json({
                status: 200,
                success : true,
                myTeams
            });
        } catch (error) {
            next(error)
        }
    }
    async removeTeamById(req, res, next){
        try {
            const teamId = req.params.id;
            const team = await TeamModel.findOne({teamId});
            if(!team) throw {status : 404, message : "تیمی یافت نشد"};
            const result = await TeamModel.deleteOne({_id : teamId});
            if(result.deletedCount == 0) throw { status : 500, message : "حذف تیم انجام نشد لطفا مجددا تلاش کنید"};
            return res.status(200).json({
                status : 200,
                success:  true,
                message : "حذف تیم با موفقیت انجام شد"
            });
        } catch (error) {
            next(error)
        }
    }

    // htpp://anything.com/team/invite/:teamId/:username
    async inviteUserToTeam(req, res, next){
        try {
            const {username, teamId} = req.params;
            const userId = req.user._id;
            const team = await this.findeUserInTeam(teamId, userId);
            if(!team) throw { status : 400, message : "تیمی جهت دعوت عضو یافت نشد"};
            const user = await UserModel.findOne({username});
            if(!user) throw { status : 400, message : "کاربر مورد نظر جهت دعوت به تیم یافت نشد"};
            const userInvited = await this.findeUserInTeam(teamId, user._id);
            if(userInvited) throw { status : 400, message : "کاربر مورد نظر قبلا به تیم دعوت شده است"};
            const request = {
                teamId,
                caller : req.user.username,
                requestDate : new Date(),
                status : "pending"
            };
            const result = await UserModel.updateOne({username},{
                $push : {inviteRequests : request}
            });
            if(result.modifiedCount == 0) throw { status : 500, message : "درخواست دعوت ثبت نشد"};
            return res.status(200).json({
                status : 200,
                success : true,
                message : "درخواست دعوت به تیم برای کاربر ارسال شد"
            });
        } catch (error) {
           next(error) 
        }
    }
    removeUserFromTeam(){

    }
    async editTeam(req, res, next){
        try {
            const data = {...req.body};
            const userId = req.user._id;
            const {teamId} = req.params;
            const team = await TeamModel.findOne({owner : userId, _id : teamId});
            if(!team) throw { status : 404, message : "تیمی یافت نشد"};
            Object.keys(data).forEach((key) => {
                if([""," ",null, undefined, NaN].includes(data[key])) delete data[key];
                if(!["name", "description"].includes(key)) delete data[key];
            });
            const updateResult = await TeamModel.updateOne({_id: teamId}, {
                $set : data
            });
            if(updateResult.modifiedCount == 0) throw { status : 500, message : "ویرایش مشخصات تیم انجام نشد"};
            return res.status(200).json({
                status : 200,
                success : true,
                message : "ویرایش مشخصات تیم با موفقیت انجام شد"
            });
        } catch (error) {
            next(error)
        } 
    }
    async findeUserInTeam(teamId, userId){
        const result = await TeamModel.findOne({
            $or : [
                {owner : userId},
                {users : userId}
            ],
            _id : teamId
        });
        return !!result;
    }
}

module.exports = {
    TeamController : new TeamController(),
};