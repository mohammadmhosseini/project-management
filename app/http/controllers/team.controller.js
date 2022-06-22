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
            const myTeams = await TeamModel.find({
                $or : [
                    {owner : userId},
                    {users : userId}
                ]
            });
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
    editTeam(){
        
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