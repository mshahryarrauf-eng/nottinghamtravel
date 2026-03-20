import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Type: { type: String, enum: ['Adult', 'Child'], required: true },
});

const PricingSchema = new mongoose.Schema({
  TotalTBOFare: { type: Number, required: true },
  TotalTBOTax: { type: Number, required: true },
  OurMarkupPrice: { type: Number, required: true },
  FinalPrice: { type: Number, required: true },
  Currency: { type: String, default: 'USD' },
});

const HotelBookingSchema = new mongoose.Schema({
  BookingCode: { type: String, required: true },
  TBOReferenceId: { type: String },
  Status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Failed'],
    default: 'Pending',
  },
  OurReferenceId: { type: String, required: true },
  BookingType: { type: String, enum: ['Voucher', 'Confirm'], required: true },
  PaymentMode: { type: String, enum: ['Limit', 'CreditCard', 'Prepaid'], required: true },
  PhoneNumber: { type: String, required: true },
  Email: { type: String, required: true },
  Pricing: { type: PricingSchema, required: true },
  CustomerDetails: { type: [CustomerSchema], required: true },
  CreatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.HotelBooking || mongoose.model('HotelBooking', HotelBookingSchema);
