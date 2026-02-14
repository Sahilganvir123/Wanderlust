const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsnyc = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../midelwares/isLoggedIn.js");
const { populate } = require("../models/review.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfige.js");
// const upload = multer({dest: "uploads/"});
const upload = multer({storage});

//Error



//Index Raut
router.get("/", wrapAsnyc(listingController.index ));

//Create / New Raut
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.post("/",validateListing,isLoggedIn,upload.single("listing[image]"), wrapAsnyc(listingController.createNewListing));
// router.post("/",upload.single("listing[image]"), (req,res) =>{
//     res.send(req.file);
// })



//Show Raut
router.get("/:id", wrapAsnyc(listingController.showListings));


//Edit Raut
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsnyc(listingController.renderEditForm));

router.put("/:id",validateListing,isLoggedIn, isOwner,upload.single("listing[image]"), wrapAsnyc(listingController.editListing));

//Delete Raut

router.delete("/:id",isLoggedIn,isOwner,wrapAsnyc(listingController.deleteListing));


module.exports = router;