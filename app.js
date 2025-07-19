const express = require("express");
const app = express();
const port = 8080;
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const listings = require("./routes/listing.js")  //also there
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const footerRouter = require("./routes/footer.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
require('dotenv').config();

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const dbURL = process.env.ATLASDB_URL;


const mongoose = require("mongoose");

main().then((result)=>{
    console.log("Connection Successful with database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbURL);
}


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //1 week tym
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


//--------------------------------------------------------------------------------------------------//
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware for Flash Messages
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// //Root Route
// app.get("/",(req,res)=>{
//     res.send("Hi I am Root");
// })

//----------------------------------------------------------------------------------------------------//

//Require from routes listing.js------------
app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",userRouter);
app.use("/",footerRouter);


//Rest of all
app.use(/.*/,(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

//--------------------------------------------------------------------------------------------------//

//Error handler
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"} = err;
    res.status(status).render("listings/error.ejs",{message,status});
    // res.status(status).send(message);
});



//----------------------------------------------------------------------------------------------------//
//Server Listening Control
app.listen(port,()=>{
    console.log("Server is working successfully!");
});
