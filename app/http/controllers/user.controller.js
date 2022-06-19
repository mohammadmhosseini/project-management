class UserController{
    getProfile(req, res, next){
        const user = req.user;
        return res.status(200).json({
            status: 200,
            success: true,
            user,
        });
    }
    editProfile(){

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