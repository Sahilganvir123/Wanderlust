const User= require("../models/user.js");



module.exports.renderSignUpForm = (req,res)=>{
    res.render("./views/listings/signUp.ejs");
};

module.exports.signUp = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
    let newUser = await new User ({username,email});
    let createdUser = await User.register(newUser , password);
    // req.flash("success","Welcome to Wanderlust");
    req.login(createdUser, (err)=>{
        if(err){
        return next(err);
        }else{

            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
            
        }
    });
    
    }
    catch (e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    };
    
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("./views/listings/login.ejs");
};

module.exports.login = async(req,res)=>{
    

    req.flash("success","Welcome Back IN Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    if(redirectUrl.length >= 20){
        // console.log("work");
        return res.redirect("/listings");
    }

    res.redirect(redirectUrl);
    

};

module.exports.logOut =  (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next (err);
        }
        else{
            req.flash("success","User LogOut Successfully");
            res.redirect("/listings");
        }
    });
};