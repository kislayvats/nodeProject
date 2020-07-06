var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var Campground=require("../models/campgrounds");
// ================
// LANDING ROUTE
// ================
router.get("/",function(req,res){
    res.render("landing");
});


// ================
// AUTHENTICATION
// ================
router.get("/register",function(req,res){
    res.render("register");
});
//REGISTER LOGIC
router.post("/register",function(req,res){
    req.body.username
    req.body.password
   var newuser= new User(
       {
           username:req.body.username,
           firstname:req.body.firstname,
           lastname:req.body.lastname,
           email:req.body.email,
           avatar:req.body.avatar
        });
   if(req.body.admincode==="secret123"){
       newuser.isAdmin=true;
   }
    User.register(newuser,req.body.password,function(error,user){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","You Have Been Registered");
                res.redirect("/campgrounds");
            });
           
        }
    });
});
//LOGIN GET REQUEST
router.get("/login",function(req,res){
    res.render("login");
});
//LOGIN LOGIC
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}
),function(req,res){

}
);

//LOGOUT LOGIC
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","You Have Been Logged Out");
    res.redirect("/");
});

//USER PROFILE
router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(error,founduser){
        if(error){
            req.flash("error","something went wrong");
            res.redirect("/");
        }
        else{
            Campground.find().where('author.id').equals(founduser._id).exec(function(err,campgrounds){
                if(err){
                    req.flash("error","something went wrong");
                    res.redirect("/");
                }
                res.render("showuser",{user:founduser,campgrounds:campgrounds});
            })
           
        }

    });
});




module.exports=router;