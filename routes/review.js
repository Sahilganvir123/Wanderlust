const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsnyc = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateRiview, isLoggedIn, isReviewAuther, saveRedirectUrl} = require("../midelwares/isLoggedIn.js");
const reviewController = require("../controller/reviews.js");


//Error



//Reveiw
//Post raut
//Create Reveiw

router.post("/review",validateRiview,isLoggedIn, wrapAsnyc (reviewController.createReview));

//Review Delete raut
//Delete Review
router.delete("/review/:reviewId",isLoggedIn,isReviewAuther,saveRedirectUrl, wrapAsnyc (reviewController.deleteReview));

module.exports= router;