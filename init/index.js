const mongoose = require("mongoose");
const initData = require("./data.js");
const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connection sucssesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_URL);
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, owner: "69627091920bbfedf3a8eb09"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initilize");
}

initDb();