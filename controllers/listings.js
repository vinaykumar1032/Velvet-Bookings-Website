const Listing = require("../models/listing");
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route callback
module.exports.index = async (req, res) => {
    const {title} = req.query;
    let allListings;
    if (title) {
        const regex = new RegExp(title, "i"); // case-insensitive match
        allListings = await Listing.find({ title: regex });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, searchTitle: title });
};


//new route callback
module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
}

//show route callback
module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing not found or not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

//Create route callback
module.exports.create = async (req, res, next) => {           //Geo Coding converts City to Coordinates github repo mapbox Geocoding docs->services->Search full docum..
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send()
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing has been created successfully!");
    res.redirect("/listings");
}

//Edit route callback
module.exports.edit = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found or not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

//update route callback
module.exports.update = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Existing Listing has been Updated successfully!");
    res.redirect(`/listings/${id}`);
}

//delete route callback
module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing has been Deleted successfully!");
    res.redirect("/listings");
}

