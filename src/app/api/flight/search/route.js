import { searchFlightsFromSabre } from "@/lib/sabreSearch";

export async function POST(req) {
  try {
    const body = await req.json();

    const data = await searchFlightsFromSabre(body);
console.log(data)
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Sabre API error:", err);
    return new Response(JSON.stringify({ error: "Flight search failed" }), {
      status: 500,
    });
  }
}
