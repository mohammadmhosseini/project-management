const {Schema, model, Types} = require("mongoose");

const UserSchema = new Schema({
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, required : true, unique : true},
    email : {type : String, required : true, unique : true},
    mobile : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    profile_image : {type : String},
    teams : {type : [Types.ObjectId], default : []},
    skills : {type : [String], default : []},
    role : {type : [String], default : ["USER"]},
    token : {type : String, default : ""}
},
{
    timestamps : true
});

const UserModel = model("user", UserSchema);

module.exports = {
    UserModel,
};
// user