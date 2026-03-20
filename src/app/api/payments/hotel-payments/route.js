// import Stripe from 'stripe';
// import { connectDB } from '@/lib/db';
// import HotelBooking from '@/models/hotelBooking';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const amount = body?.Pricing?.FinalPrice || 0;
//     const currency = body?.Pricing?.Currency || 'usd';

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency: currency.toLowerCase(),
//       automatic_payment_methods: { enabled: true },
//     });

//     const bookingDoc = new HotelBooking(body);
//     await bookingDoc.save();

//     return new Response(
//       JSON.stringify({
//         clientSecret: paymentIntent.client_secret,
//         bookingId: bookingDoc._id,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// export async function GET(req) {
//   try {
//     await connectDB();
//     const bookings = await HotelBooking.find().sort({ CreatedAt: -1 });
//     return new Response(JSON.stringify(bookings), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }


/* =========================
   🚧 TEMP DEMO MODE START
   ========================= */

import { connectDB } from '@/lib/db';
import HotelBooking from '@/models/hotelBooking';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Optional: still save booking
    const bookingDoc = new HotelBooking(body);
    await bookingDoc.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment system in demo mode",
        clientSecret: "demo_client_secret_123",
        bookingId: bookingDoc._id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Demo mode error",
      }),
      { status: 200 } // keep 200 so UI doesn't break
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const bookings = await HotelBooking.find().sort({ CreatedAt: -1 });

    return new Response(
      JSON.stringify({
        success: true,
        data: bookings,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
      }),
      { status: 200 }
    );
  }
}

/* =========================
   🚧 TEMP DEMO MODE END
   ========================= */