const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let {id} = req.params;

    let newReview = await new Review(req.body.review);
    newReview.auther = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);


    await newReview.save();
    await listing.save();

    // console.log("reveiw saved");
    req.flash("success","Review Created!")

    res.redirect(`/listings/${id}`);

};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);

};