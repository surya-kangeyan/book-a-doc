var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose") ;
var doctorSchema = new mongoose.Schema({
    name:String,
    profession:{type:String,default:"doctor"},
    speciality:String,
    experience:String,
    username:String,
    password:String,
});
doctorSchema.methods.authenticate = function(password) {
    //implementation code goes here
  }
doctorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Doctor",doctorSchema);