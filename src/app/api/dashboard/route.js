import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

// Models import
import Contact from "@/models/contact";
import HotelBooking from "@/models/hotelBooking";
import Offer from "@/models/offer";
import TailormadeQuery from "@/models/tailorMadeQuery";
import Booking from "@/models/bookOffer";

export async function GET() {
  try {
    await connectDB();

    // ------------------ Counts ------------------
    const totalContactsQueries = await Contact.countDocuments();
    const totalHotelBookings = await HotelBooking.countDocuments();
    const totalOffers = await Offer.countDocuments();
    const totalTailorQueries = await TailormadeQuery.countDocuments();

    // Only succeeded package bookings
    const totalPackageBookings = await Booking.countDocuments({
      status: "succeeded",
    });

    // ------------------ Latest ------------------
    const latestContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const latestOfferBookings = await Booking.find({ status: "succeeded" })
      .sort({ createdAt: -1 })
      .limit(5);
    const latestHotelBookings = await HotelBooking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ------------------ Aggregate sums for hotels ------------------
    const hotelsPaymentsAggregate = await HotelBooking.aggregate([
      {
        $group: {
          _id: "$Pricing.Currency", // Group by currency
          totalTBOFare: { $sum: "$Pricing.TotalTBOFare" },
          totalTBOTax: { $sum: "$Pricing.TotalTBOTax" },
          totalMarkup: { $sum: "$Pricing.OurMarkupPrice" },
          totalFinalPrice: { $sum: "$Pricing.FinalPrice" },
        },
      },
    ]);

    const hotelsPayments = hotelsPaymentsAggregate[0] || {
      totalTBOFare: 0,
      totalTBOTax: 0,
      totalMarkup: 0,
      totalFinalPrice: 0,
    };

    // ------------------ Aggregate sums for package bookings ------------------
   const packagesPaymentsAggregate = await Booking.aggregate([
  { $match: { status: "succeeded" } },
  {
    $group: {
      _id: "$currency", // group by currency
      totalAmount: { $sum: "$totalAmount" },
    },
  },
]);

// Agar koi result nahi, empty array
const packagesPayments = packagesPaymentsAggregate.length
  ? packagesPaymentsAggregate.map(p => ({
      currency: p._id,
      totalAmount: p.totalAmount,
    }))
  : [];


    // ------------------ Response ------------------
    return NextResponse.json({
      success: true,
      stats: {
        contacts: totalContactsQueries,
        hotelsBookings: totalHotelBookings,
        packagesBookings: totalPackageBookings,
        offers: totalOffers,
        tailorQueries: totalTailorQueries,
      },
      payments: {
        hotels: hotelsPayments,
        packages: packagesPayments,
      },
      latest: {
        contacts: latestContacts,
        packagesBookings: latestOfferBookings,
        hotelsBookings: latestHotelBookings,
      },
    });
  } catch (error) {
    console.log("Dashboard Error:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
