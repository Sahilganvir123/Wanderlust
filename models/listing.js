const mongoose = require("mongoose");
const Review = require("./review");
const { string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
        // filename:{
        //     type:String,
        // },
        // type:String,
        // default:"https://th.bing.com/th/id/OIP.o1ciWGTZVY3neCvEPps7PgHaEI?w=305&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
        // set: (v) => v === ""?"https://th.bing.com/th/id/OIP.o1ciWGTZVY3neCvEPps7PgHaEI?w=305&h=180&c=7&r=0&o=7&pid=1.7&rm=3":v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "review",
    }],
    owner :{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
     geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});
   
const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;