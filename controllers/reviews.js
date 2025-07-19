const Listing =  require("../models/listing");
const Review = require("../models/review");

module.exports.createReviews = async(req,res)=>{
   let listing =  await Listing.findById(req.params.id);
   console.log(req.params.id);                                //unlisted if express.Router({mergeParams: true});
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);


   await newReview.save();
   await listing.save();
   console.log("New Review Saved!");
   req.flash("success","Thanks for submitting your valuable feedback!");
   res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReviews = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Existing Listing Review has been deleted successfully!");
    res.redirect(`/listings/${id}`);
}