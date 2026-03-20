import { tboFetch } from "@/app/utils/tboClient";

export async function POST(req) {
  try {
    const { CityCode,IsDetailedResponse ,  Language = "EN" } = await req.json();

    if (!CityCode) {
      return Response.json({ error: "CityCode is required" }, { status: 400 });
    }

    // TBO API body
    const body = {
      CityCode,
      IsDetailedResponse,
      Language
    };

    const data = await tboFetch("TBOHotelCodeList", body);

    // Return hotels list
    return Response.json(data);
  } catch (err) {
    console.error("HotelsListByCity Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
