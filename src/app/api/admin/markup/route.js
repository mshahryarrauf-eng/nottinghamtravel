import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Markup from "@/models/markup";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

export async function GET(req) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        await connectDB();
        const markups = await Markup.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: markups });
    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { type, amount, category } = await req.json();

        if (!type || !amount || !category) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        await connectDB();

        const existingMarkup = await Markup.findOne({ category });

        if (existingMarkup) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Markup for "${category}" already exists. Please edit the existing one instead.`,
                },
                { status: 409 }
            );
        }

        const newMarkup = await Markup.create({ type, amount, category });

        return NextResponse.json({
            success: true,
            message: "Markup added successfully",
            data: newMarkup,
        });
    } catch (err) {
        console.error("POST Error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id, type, amount, category } = await req.json();
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Markup ID is required" },
                { status: 400 }
            );
        }

        await connectDB();
        const updated = await Markup.findByIdAndUpdate(
            id,
            { type, amount, category },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Markup not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (err) {
        console.error("PUT Error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Markup ID is required" },
                { status: 400 }
            );
        }

        await connectDB();
        const deleted = await Markup.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Markup not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Markup deleted successfully" });
    } catch (err) {
        console.error("DELETE Error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
