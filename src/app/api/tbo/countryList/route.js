import { tboFetch } from "@/app/utils/tboClient";

export async function GET() {
  try {
    // GET request for country list
    const data = await tboFetch("CountryList", {}, "GET"); // pass "GET" method
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("CountryList Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
