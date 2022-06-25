const {Schema, model, Types} = require("mongoose");

const TeamSchema = new Schema({
    name : {type : String, required : true},
    description : {type : String},
    username : {type : String, required : true, unique : true},
    users : {type : [Types.ObjectId], default : []},
    owner : {type : Types.ObjectId, required : true},
},
{
    timestamps : true
});

const TeamModel = model("team", TeamSchema);

module.exports = {
    TeamModel,
};