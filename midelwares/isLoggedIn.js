const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
// const review = require("../models/review.js");



module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        // Save OriginalUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User not Logged In");
        res.redirect("/login"); 
        // console.log(req.session.redirectUrl);
    }else{
    next();
    }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
        next();
}


module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!res.locals.currUser.equals( listing.owner._id)){
        req.flash("error","Your not Owner of this Listing");
       return res.redirect(`/listings/${id}`);
    }
    next();

    };

    module.exports.isReviewAuther=async(req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals( review.auther._id)){
        req.flash("error","Your not Auther of this Review");
       return res.redirect(`/listings/${id}`);
    }
    next();

    };


  module.exports.validateListing = (req,res,next)=>{
     let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map ((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


module.exports.validateRiview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map ((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}