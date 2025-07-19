const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
//-----------------------------------------------------------------------------------------------------------------------------------//
module.exports.isLoggedIn = (req,res,next)=>{
    //console.log(req.user);                     //gives if logged in toh object dega user details ki
    if(!req.isAuthenticated()){ //login h ya nahi
        //redirect problem - iski xrurat tb h jb user login nhi h
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create & to make changes in listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have an access to edit or delete listing as you are not owner of this listing!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have an access to edit or delete listing comments/reviews!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}