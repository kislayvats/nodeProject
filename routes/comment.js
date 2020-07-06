var express=require("express");
var router=express.Router();
var campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");
// ====================
// COMMENT ROUTES
// ====================

router.get("/campgrounds/:id/comment/new",middleware.isloggedin,function(req,res){
    campground.findById(req.params.id,function(error,foundcamp){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            // Comment.find({},function(error,comments){
            //     if(error){
            //         console.log(error);
            //     }
            //     else{
            //         res.render("newcomment",{campground:foundcamp});
            //     }
            // });

          res.render("newcomment",{campground:foundcamp});
        }
    });
});

router.post("/campgrounds/:id/comment",middleware.isloggedin,function(req,res){
    campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }
        else{
            Comment.create(req.body.comment,function(error,comment){
                if(error){
                    console.log(error);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","You Added A New Comment !!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});
// ================
// EDIT ROUTES
// ================
 

router.get("/campgrounds/:id/comment/:comment_id/edit",middleware.checkcommentownership,function(req,res){
    campground.findById(req.params.id,function(error,foundcamp){
        if(error){
            console.log(error);
        }
        else{
          Comment.findById(req.params.comment_id,function(error,commentfound){
              if(error){
                  console.log(error);
              }
              else{
              res.render("editcomment",{campground:foundcamp,comment:commentfound});
              }
          });
        }
    });
});


router.put("/campgrounds/:id/comment/:comment_id",middleware.checkcommentownership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error,updatedcomment){
        if(error){
            console.log(error);
        }
        else{
        updatedcomment.save();
        req.flash("success","You Updated Your Comment !!");
        res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// ===============
// DELETE
// ===============


router.delete("/campgrounds/:id/comment/:comment_id",middleware.checkcommentownership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(error){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            req.flash("success","You Deleted Your Comment !!");
            res.redirect("back");
        }
    });
});
module.exports=router;
