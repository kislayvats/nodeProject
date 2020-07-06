var express=require("express");
var router=express.Router();
var campground=require("../models/campgrounds");
var middleware=require("../middleware");





// ====================
// CAMPGROUND ROUTES
// ====================
router.get("/campgrounds",function(req,res){
    campground.find({},function(error,campground){
        if(error){
            console.log(error);
        }
        else{
            res.render("campgrounds",{campground:campground});
        }
    });
});

router.get("/campgrounds/new",middleware.isloggedin,function(req,res){
    res.render("newcampground");
});
//CREATE - add new campground to DB
router.post("/campgrounds",middleware.isloggedin,function(req,res){
    //get data from form and add to campgrounds array
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
    var price=req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {title: title, image: image, description: description, author:author,price:price}
   // Create a new campground and save to DB
    campground.create(newCampground,function(error,newlycreatedcampground){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            // newlycreatedcampground.save();
            req.flash("success","You Created A Campground !!!");
            res.redirect("/campgrounds");
        }
    });
});


router.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(error,foundcamp){
     if(error){
         console.log(error);
     }   
     else{
         //render show template with that campground
        res.render("show",{campground:foundcamp})
     }
    
    });

});


// ================
// EDIT ROUTES
// ================

router.get("/campgrounds/:id/edit",middleware.checkcampgroundownership,function(req,res){
    campground.findById(req.params.id,function(error,foundcamp){
        if(error){
            console.log(error);
        }
        else{
            res.render("editcampground",{campground:foundcamp});
        }
    });
});

router.put("/campgrounds/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.camp,function(error,updatedcampground){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            req.flash("success","You Updated Your Campground");
            updatedcampground.save();
res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


// ===============
// DELETE
// ===============

router.delete("/campgrounds/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(error){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            req.flash("success","You Have Deleted Your Campground");
            res.redirect("/campgrounds");
        }
    });
});

    module.exports=router;