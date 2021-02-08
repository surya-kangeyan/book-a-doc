var mongoose = require("mongoose");
var reciptSchema = new mongoose.Schema({
    name:String,
    mob:String,
    description:String,
    doctor:String,
    date:{type:Date,default:Date.now},
    status:String,
    reason:String,
    appoint_date:{type:Date},
    appoint_time:String

});
module.exports= mongoose.model("Recipt",reciptSchema);