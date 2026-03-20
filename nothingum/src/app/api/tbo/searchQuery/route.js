import { tboFetch } from "@/app/utils/tboClient";
import { connectDB } from "@/lib/db";
import Markup from "@/models/markup";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Step 1: Fetch hotels
    const searchResponse = await tboFetch("search", body, "POST");
    if (!searchResponse || searchResponse?.Status?.Code !== 200) {
      return Response.json(
        {
          success: false,
          message: searchResponse?.Status?.Description || "TBO Search API Error",
        },
        { status: 500 }
      );
    }

    const hotels = searchResponse?.HotelResult || [];
    if (!hotels.length) {
      return Response.json({ success: true, data: [], message: "No hotels found" });
    }

    // ✅ Step 2: Fetch details
    const hotelCodes = hotels.map((h) => h.HotelCode).join(",");
    const payLoad = { Hotelcodes: hotelCodes, Language: "EN" };
    const hotelDetailsResponse = await tboFetch("Hoteldetails", payLoad);

    if (!hotelDetailsResponse?.HotelDetails) {
      return Response.json({
        success: false,
        message: "Failed to fetch hotel details",
      });
    }

    const detailsMap = new Map(
      hotelDetailsResponse.HotelDetails.map((h) => [h.HotelCode, h])
    );

    // ✅ Step 3: Fetch markup
    await connectDB();
    const markup = await Markup.findOne({ category: "Hotels" });

    const markupType = markup?.type || null;
    const markupAmount = markup?.amount || 0;

    // ✅ Step 4: Merge + calculate markup safely
    const mergedHotels = hotels.map((hotel) => {
      const details = detailsMap.get(hotel.HotelCode) || {};

      const rooms = (hotel.Rooms || []).map((room) => {
        // 🧮 Extract price precisely without losing decimals
        const basePriceRaw = room?.TotalFare ?? 0;

        // ensure it's a float but preserve precision
        const basePrice = parseFloat(basePriceRaw.toString());
        let finalPrice = basePrice;

        if (markupType === "Percentage") {
          finalPrice = basePrice + (basePrice * markupAmount) / 100;
        } else if (markupType === "Fixed") {
          finalPrice = basePrice + markupAmount;
        }

        return {
          ...room,
          BasePrice: +basePrice.toFixed(6), // up to 6 decimal precision, keeps value like 123.456789
          FinalPrice: +finalPrice.toFixed(6),
          MarkupType: markupType,
          MarkupAmount: markupAmount,
        };
      });

      return {
        ...details,
        HotelCode: hotel.HotelCode,
        Currency: hotel.Currency || "USD",
        Rooms: rooms,
      };
    });

    return Response.json(
      {
        success: true,
        message: "Hotels fetched successfully with markup applied",
        data: mergedHotels,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Hotel Search Error:", err);
    return Response.json(
      {
        success: false,
        message: err.message || "Something went wrong while fetching hotels",
      },
      { status: 500 }
    );
  }
}
