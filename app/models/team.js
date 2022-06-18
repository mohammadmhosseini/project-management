const {Schema, model, Types} = require("mongoose");

const TeamSchema = new Schema({
    name : {type : String, required : true},
    description : {type : String},
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