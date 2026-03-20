import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Destructure incoming data
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // 🔍 Find admin user
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found or unauthorized." },
        { status: 404 }
      );
    }

    // 🔑 Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    // 🧾 Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Admin login successful!",
        data: {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error! Please try again." },
      { status: 500 }
    );
  }
}
