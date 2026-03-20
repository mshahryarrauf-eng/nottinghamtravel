import { NextResponse } from "next/server";
import Booking from "@/models/bookOffer";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      contact,
      guests,
      offerId,
      fareType,
      amount,
      totalAmount,
      currency,
    } = data;

    if (
      !contact?.phone ||
      !contact?.email ||
      !guests?.length ||
      !offerId ||
      !fareType ||
      !amount ||
      !totalAmount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      contact,
      guests,
      offerId,
      fareType,
      amount,
      currency,
      totalAmount,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: currency,
      metadata: { bookingId: booking._id.toString() },
      receipt_email: contact.email,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      booking: booking,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}



export async function PATCH(req) {
  try {
    await connectDB();
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "succeeded", "failed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 }).populate("offerId");; 
    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}