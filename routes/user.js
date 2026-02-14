const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsnyc = require("../utils/wrapAsync.js");
const User= require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../midelwares/isLoggedIn.js");
const userController = require("../controller/user.js");


router.get("/signUp",userController.renderSignUpForm);


router.post("/singUp",userController.signUp);

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{ 
    failureRedirect: '/login' , 
    failureFlash: true
  }) ,

 (userController.login));

router.get("/logout",userController.logOut);



module.exports= router;