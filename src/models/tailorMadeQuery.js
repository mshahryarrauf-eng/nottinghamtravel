import mongoose from 'mongoose';

const TailormadeQuerySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    lookingFor: [{ type: String, enum: ['Flight Only', 'Hotel Only', 'Package'] }],
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    leavingFrom: { type: String, required: true },
    destination: { type: String, required: true },
    hotelRating: { type: Number, min: 1, max: 5 },
    transfers: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.TailormadeQuery ||
  mongoose.model('TailormadeQuery', TailormadeQuerySchema);
