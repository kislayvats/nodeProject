var campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middlewareobj={};
// CAMPGROUND OWNERSHIP
middlewareobj.checkcampgroundownership=function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(error,foundcamp){
            if(error){
                console.log(error);
            }
            else{
                if(foundcamp.author.id.equals(req.user._id)){
                     next();
                }
                else{
                    console.log("no permission");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        
        res.redirect("back");
    }
}

//COMMENT OWNERSHIP
middlewareobj.checkcommentownership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(error,foundcomment){
            if(error){
                console.log(error);
            }
            else{
                if(foundcomment.author.id.equals(req.user._id)){
                     next();
                }
                else{
                    console.log("no permission");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        res.redirect("back");
    }
}
  //ISLOGGEDIN LOGIC
  middlewareobj.isloggedin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You are not logged in. Login first.");
        res.redirect("/login");
    }
    }
    module.exports=middlewareobj;