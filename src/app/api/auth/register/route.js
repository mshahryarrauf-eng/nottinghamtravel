import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRegisterInput } from "../../../utils/validation";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, phone, role } = await req.json();

    const { valid, error } = validateRegisterInput({ name, email, password, phone, role });
    if (!valid) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "member",
    });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = new Response(
      JSON.stringify({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      }),
      { status: 201 }
    );
    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure=false`
    );
    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
