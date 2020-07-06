var PORT=process.env.PORT || 3000;
var express=require("express");
var app=express();
var mongoose=require("mongoose");
var methodoverride=require("method-override");
var bodyparser=require("body-parser");
var flash=require("connect-flash");
var campground=require("./models/campgrounds");
var Comment=require("./models/comment");
var User=require("./models/user");
var passport=require("passport");
var localstrategy=require("passport-local");
var commentRoutes=require("./routes/comment");
var campgroundRoutes=require("./routes/campground");
var indexRoutes=require("./routes/index");
// mongoose.connect("mongodb+srv://kislayvats:hellokislay123@cluster0-y0jwq.mongodb.net/yelpcampdatabase?retryWrites=true&w=majority",{
//     useNewUrlParser:true,
//     useCreateIndex:true
// }).then(() => {
//     console.log("connected to DB!");
// }).catch(err =>{
//     console.log("error",err.message);
// });

mongoose.connect("mongodb+srv://kislayvats:hellokislay123@cluster0-y0jwq.mongodb.net/yelpcampdatabase?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true},function(error,success){
    if(!error){
        console.log("success");
    }
    else{
        console.log("error");
    }
});


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://kislayvats:Alpha@corona#879@cluster0-y0jwq.mongodb.net/yelpcampdatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodoverride("_method"));
//FLASH
app.use(flash());
mongoose.set('useFindAndModify', false);
//EXPRESS SESSION
app.use(require("express-session")({
    secret:"Hello vats",
    resave:false,
    saveUninitialized:false
})); 
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//LOGIC FOR KEEPING INFORMATION ABOUT USER ON ALL PAGES
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//ROUTE HANDELING
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);



//SERVER STARTING COMMAND
app.listen(PORT,function(){
    console.log("Server started at http://Localhost:3000");
});