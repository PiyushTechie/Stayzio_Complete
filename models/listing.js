import mongoose from "mongoose";
import Review from "./reviews.js";

const { Schema, connect } = mongoose;

// Optional: Connect from here if needed (better handled centrally)
async function main() {
  try {
    await connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("DB Connected Successfully");
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
}


const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },  // 👈 NEW FIELD
  category: {
    type: String,
    enum: [
      "rooms",
      "cities",
      "mountains",
      "castles",
      "pools",
      "camping",
      "farms",
      "beach",
      "luxury",
      "cabins",
      "boats",
      "all"
    ],
    default: "all"
  }
  },
  {timestamps: true }
);

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;