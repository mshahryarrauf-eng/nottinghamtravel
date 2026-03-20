import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  type: { type: String, default: "Adult" }, 
});

const bookingOfferSchema = new mongoose.Schema(
  {
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    guests: {
      type: [guestSchema],
      required: true,
      validate: [guests => guests.length > 0, "At least one guest required"],
    },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    fareType: { type: String, enum: ["Per Person", "Total"], required: true },
    amount: { type: Number, required: true },        
    currency: { type: String, required: true },        
    totalAmount: { type: Number, required: true },
     status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending", 
    },
  },
  
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingOfferSchema);
