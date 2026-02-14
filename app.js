if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const atlasDb_Url = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js")
// const { expression } = require("joi");
const listing = require("./routes/listings.js");
const review = require("./routes/review.js");
const loginUser = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;



const flash = require('connect-flash');
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

main().then(()=>{
    console.log("connection sucssesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(atlasDb_Url);
}
// const connectToDB = async () => {
//   try {
//     await mongoose.connect(atlasDb_Url);
//     console.log('Connected to DB');
//   } catch (err) {
//     console.error(`Error while connecting to DB: ${err.message}`);
//   }
// };

app.set("view engine","ejs");
app.set("views", path.join(__dirname),"views");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: atlasDb_Url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});


const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie: {
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/",(req,res)=>{
    res.send("i am root");
})

// app.get("/demouser",async (req,res)=>{  
//     let demoUser = new User({
//         email: "sahilganvir45@gmail.com",
//         username: "Sahilganvir",
//     });
//     let createdUser = await User.register(demoUser,"Sahil@2005");
//     res.send(createdUser);
// })


app.use("/listings", listing);
app.use("/listings/:id", review);
app.use("/",loginUser);

app.all(/.*/, (req,res,next) =>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("./views/listings/error.ejs", {message});
    
})

// app.use((err,req,res,next) => {
//     res.send("something went wrong!")
// })

app.listen(8080,async()=>{
    console.log("app is listining on port 8080");
});
// app.listen(8080, async()=>{
// await connectToDB()
//     console.log("app is listining on port 8080");
// })