const {Schema, model, Types} = require("mongoose");

const InviteRequest = new Schema({
    teamId : {type : Types.ObjectId, required : true,},
    caller : {type : String, required : true, lowercase : true},
    requestDate : {type : Date, default : new Date()},
    status : {type : String, default : "pending"} // pending, accepted, rejected
})
const UserSchema = new Schema({
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, required : true, unique : true}, // lowercase : true},
    email : {type : String, required : true, unique : true}, // lowercase : true},
    mobile : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    profile_image : {type : String},
    teams : {type : [Types.ObjectId], default : []},
    skills : {type : [String], default : []},
    role : {type : [String], default : ["USER"]},
    token : {type : String, default : ""},
    inviteRequests : {type : [InviteRequest]}
},
{
    timestamps : true
});

const UserModel = model("user", UserSchema);

module.exports = {
    UserModel,
};