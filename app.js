if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}
// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("API Key:", process.env.CLOUD_API_KEY);
// console.log("API Secret:", process.env.CLOUD_API_SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listning.js"); // Model import
main().catch(err => console.log(err));
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilis/wrapasync.js");
const ExpressError = require("./utilis/customerror.js");
const Review=require("./models/review.js")
const  {listingSchema}=require("./schema.js");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");  
const User=require("./models/user.js");
const { isloggedin, saveRediectUrl } = require("./middleware.js");
const multer  = require('multer');
const {storage}=require("./cloudconfig.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:  mapToken});




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "publlic"))); // fixed folder spelling

const store=MongoStore.create({
    mongoUrl:process.env.ATLAS_DB_URL,
    crypto: { 
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",function(e){
    console.log("session store error",e);  
})
const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httoOnly:true
    }
};
app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ek middleaware create karnge
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
app.get("/demouser" ,async(req,res)=>{
    let fakeuser=new User({
        email:"harsh@gmail.com",
        username:"harsh",
    });
     let registeruser=await User.register(fakeuser,"helloworld");
     console.log(registeruser);
     res.send(registeruser);
});
async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlast');
    await mongoose.connect(process.env.ATLAS_DB_URL);
}

let port = 7560;

 // INDEX ROUTE
 app.get("/listings", wrapAsync(async (req, res) => {
     const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
 }));
 
 // NEW ROUTE
 app.get("/listings/new", isloggedin,(req, res) => {
     res.render("listings/new.ejs");
 });
 
 // SHOW ROUTE
 app.get("/listings/:id", wrapAsync(async (req, res) => {
     const { id } = req.params;
     const listing = await Listing.findById(id).populate("review").populate("owner");
     if(!listing){
        req.flash("error","cannot find that listing");
        return res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs", { listing });
 }));
 // CREATE ROUTE
 app.post("/listings",isloggedin,upload.single("listing[image]"), wrapAsync(async (req, res) => {
    let response=await geocodingClient.
    forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();
   // console.log(response.body.features[0].geometry);
    let url=req.file.path;
    let filename=req.file.filename;
   
  let result= listingSchema.validate(req.body);
  console.log(result);
     const newListing = new Listing(req.body.listing);
     console.log(req.user); 
        newListing.owner=req.user._id;
        newListing.image.url=url;
        newListing.image.filename=filename;
        newListing.geometry=response.body.features[0].geometry;

     let savedlisting=await newListing.save();
     console.log(savedlisting);
     req.flash("success","new listing created");
     res.redirect("/listings");
 }));
// app.post('/listings', upload.single("listing[image]"), (req, res) => {
//     // req.file में Cloudinary का response आएगा
//     // इसमें path (URL), filename, size, format आदि होंगे
//     console.log(req.file); 
//     res.send(req.file); // बस browser में Cloudinary info दिखा देगा
// });
 // EDIT ROUTE
 app.get("/listings/:id/edit",isloggedin, wrapAsync(async (req, res) => {
     const { id } = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs", { listing });
 }));
 
 // UPDATE ROUTE
 app.put("/listings/:id",isloggedin, wrapAsync(async (req, res) => {
     const { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     res.redirect(`/listings/${id}`);
 }));
 
 // DELETE ROUTE
 app.delete("/listings/:id",isloggedin, wrapAsync(async (req, res) => {
     const { id } = req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
 }));
 

  //review route create karenge
  //post route
  app.post("/listings/:id/reviews",async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.review.push(newReview);
    await listing.save();
    await newReview.save();
     res.redirect(`/listings/${listing.id}`);
  })
  //review me delete route 
 app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
// ROOT ROUTE
app.get("/", (req, res) => {
    res.send("Hi, I am the root route!");
});

//ab user ke liye route create karenge
app.get("/signup", (req,res)=>{
   
    res.render("users/signup.ejs");  // ✅ define first
});
//ab hum post karke database me dalengea
app.post("/signup",async(req,res,next)=>{
    let {username,email,password}=req.body;
    const newUser= new User({username,email});;
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    })
});
//login routehum baneye login route
app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
 //to create post login route
app.post(
  "/login",
  saveRediectUrl,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  async (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);
//logout route
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){     
            return next(err);
        }   
        req.flash("success","logged you out");
        res.redirect("/listings");
    });
});
// 404 ROUTE
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// ERROR HANDLING
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err: { message, stack: err.stack } });
});

//ab user ke liye route create karenge


app.listen(port, () => {
    console.log("Server is running on port 7560");
});
