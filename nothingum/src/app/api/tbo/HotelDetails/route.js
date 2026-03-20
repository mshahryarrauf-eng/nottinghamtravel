import { tboFetch } from "@/app/utils/tboClient";

export async function POST(req) {
    try {
        const { Hotelcodes, Language = "EN" } = await req.json();

        // 🔹 Validation
        if (!Hotelcodes || typeof Hotelcodes !== "string" || Hotelcodes.trim() === "") {
            return Response.json(
                { success: false, error: "Hotelcodes must be a comma-separated string" },
                { status: 400 }
            );
        }

        const body = {
            Hotelcodes: Hotelcodes.trim(),
            Language,
        };
        const data = await tboFetch("Hoteldetails", body);

        if (!data) {
            return Response.json(
                { success: false, error: "No response from TBO API" },
                { status: 502 }
            );
        }

        return Response.json({
            success: true,
            request: body,
            data,
        });
    } catch (err) {
        return Response.json(
            { success: false, error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
