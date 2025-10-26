const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
//   image: {
//     url: {
//       type: String,
//       default:
//         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // actual image link
//     },
//     filename: {
//       type: String,
//       default: "listingimage",
//     },
//   },
image:{
    url: String,
    filename: String,
},
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{
    type:{
        type:String,
        enum:["Point"],
        required:true,
    },
    coordinates:{
        type:[Number],
        required:true,  
    }
}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;