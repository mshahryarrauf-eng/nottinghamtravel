import mongoose from "mongoose";
import slugify from "slugify";

const OfferSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Flight", "Hotel", "Package"],
      required: true,
    },

    fareType: {
      type: String,
      enum: ["Per Person", "Total"],
      default: "Per Person",
    },

  category: [
  {
    type: String,
    // enum: [
    //   "Family",
    //   "Adventure",
    //   "Beach Break",
    //   "Honeymoon",
    //   "Religious",
    //   "City Break",
    //   "Tours",
    //   "Sports",
    //   "Adults Only",
    //   "All Inclusive",
    //   "No Fly",
    //   "Cruise & Rail",
    //   "Cruise & Tour",
    // ],
  },
],


    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },

    active: {
      type: Boolean,
      default: true,
    },
    showOnHome: {
      type: Boolean,
      default: false,
    },

    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    airline: { type: String },
    destination: { type: String },
    journeyType: {
      type: String,
      enum: ["One Way", "Two Way"],
    },
    dateFrom: { type: Date },
    dateTo: { type: Date },
    cabinClass: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business", "First"],
    },
    description: { type: String },
    images: [{ type: String }],

    hotelName: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

// Pre-validate hook to generate unique slug
OfferSchema.pre("validate", async function (next) {
  if (!this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slug in DB
    while (await mongoose.models.Offer.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

export default mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
