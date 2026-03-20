import { tboFetch } from "@/app/utils/tboClient";

export async function POST(req) {
  const { CountryCode } = await req.json();
  if (!CountryCode) return Response.json({ error: "CountryCode required" }, { status: 400 });

  try {
    const data = await tboFetch("CityList", { CountryCode });
    return Response.json(data);
  } catch (err) {
    console.error("CitiesByCountry Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
