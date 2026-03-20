import mongoose from "mongoose";

const MarkupSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Fixed", "Percentage"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Flights", "Hotels"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Markup || mongoose.model("Markup", MarkupSchema);
