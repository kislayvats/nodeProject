var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    avatar:String,
    firstname:String,
    lastname:String,
    email:String,
    isAdmin:{type:Boolean,default:false}
});
userSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",userSchema);