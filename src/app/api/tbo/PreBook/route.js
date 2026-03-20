import { tboFetch } from "@/app/utils/tboClient";
import { connectDB } from "@/lib/db";
import Markup from "@/models/markup";

export async function POST(req) {
  try {
    const body = await req.json();

    // Step 1: Fetch data from TBO
    const data = await tboFetch("PreBook", body);

    if (!data || data?.Status?.Code !== 200) {
      return Response.json(
        { success: false, message: data?.Status?.Description || "TBO API error" },
        { status: 500 }
      );
    }

    // Step 2: Connect DB & get markup for Hotels
    await connectDB();
    const markup = await Markup.findOne({ category: "Hotels" });

    const markupType = markup?.type || "Percentage";
    const markupAmount = markup?.amount || 0;

    // Step 3: Clone original data to avoid mutation
    const updatedData = JSON.parse(JSON.stringify(data));

    // Step 4: Apply markup in each room (if exists)
    if (updatedData?.HotelResult?.length > 0) {
      updatedData.HotelResult = updatedData.HotelResult.map((hotel) => {
        if (hotel?.Rooms?.length > 0) {
          hotel.Rooms = hotel.Rooms.map((room) => {
            const basePrice = parseFloat(room?.TotalFare || 0);
            let finalPrice = basePrice;

            if (markupType === "Percentage") {
              finalPrice = basePrice + (basePrice * markupAmount) / 100;
            } else if (markupType === "Fixed") {
              finalPrice = basePrice + markupAmount;
            }

            return {
              ...room,
              FinalPrice: parseFloat(finalPrice.toFixed(6)),
              MarkupType: markupType,
              MarkupAmount: markupAmount,
            };
          });
        }
        return hotel;
      });
    }

    // Step 5: Return full untouched response + added fields
    return Response.json(updatedData, { status: 200 });
  } catch (err) {
    console.error("PreBook API error:", err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
