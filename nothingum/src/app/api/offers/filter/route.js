import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/models/offer";

function normalizeString(str) {
  if (!str) return "";
  const trimmed = str.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export async function POST(req) {
  try {
    await connectDB();
    let { type, destination, month } = await req.json();

    if (!type || !destination || !month) {
      return NextResponse.json(
        { error: "Type, destination, and month are required" },
        { status: 400 }
      );
    }

    type = normalizeString(type);
    destination = normalizeString(destination);
    const monthNumber = Number(month);

    // Case-insensitive query for type and destination
    const offers = await Offer.find({
      active: true,
      type: { $regex: new RegExp(`^${type}$`, "i") },
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
      dateFrom: {
        $gte: new Date(new Date().getFullYear(), monthNumber - 1, 1),
        $lt: new Date(new Date().getFullYear(), monthNumber, 1),
      },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, offers }, { status: 200 });
  } catch (error) {
    console.error("Offer Filter Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch filtered offers" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const offers = await Offer.find({}, "dateFrom destination type");

    const monthsSet = new Set();
    const destinationsMap = new Map();
    const typesSet = new Set();

    offers.forEach((offer) => {
      // Months
      if (offer.dateFrom) monthsSet.add(offer.dateFrom.getMonth() + 1);

      // Destinations (normalize)
      if (offer.destination) {
        const normalized = normalizeString(offer.destination);
        destinationsMap.set(normalized.toLowerCase(), normalized); // key = lower, value = capitalized
      }

      // Types (normalize)
      if (offer.type) {
        const normalizedType = normalizeString(offer.type);
        typesSet.add(normalizedType);
      }
    });

    const months = Array.from(monthsSet)
      .sort((a, b) => a - b)
      .map((num) => ({ number: num, name: monthNames[num - 1] }));

    return NextResponse.json(
      {
        success: true,
        months,
        destinations: Array.from(destinationsMap.values()).sort(),
        types: Array.from(typesSet).sort(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Offer GET Filter Data Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch filter data" },
      { status: 500 }
    );
  }
}
