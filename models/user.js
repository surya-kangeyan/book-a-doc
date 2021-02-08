var mongoose = require("mongoose");
var Recipt = require("./recipt")
var passportLocalMongoose = require("passport-local-mongoose") ;
 
var userSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    reciptid:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Recipt"

    }
  ],
    profession:String,
    speciality:String,
    experience:String,
    username:String,
    password:String,
  
});
userSchema.methods.authenticate = function(password) {
    //implementation code goes here
  }
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
