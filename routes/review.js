const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Validating Schema from Server side error handling middleware
const validateReview = (req,res,next)=>{
    if (!req.body || !req.body.review) {
        throw new ExpressError(400,"No review data provided!");
    }
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400.,result.error);
    }else{
        next();
    }
}

//Reviews Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReviews))

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReviews));

module.exports = router;