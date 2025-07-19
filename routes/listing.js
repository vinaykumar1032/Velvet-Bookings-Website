const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const validateListing=(req,res,next)=>{
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400,"No listing data provided!");
    }
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.new);

//Show Route
router.get("/:id",wrapAsync(listingController.show));

//Create Route
router.post("/", validateListing,wrapAsync(listingController.create));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

//Update Route
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(listingController.update));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));

module.exports = router;