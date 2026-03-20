import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateLogin } from "@/app/utils/validation";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    const validationErrors = validateLogin({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      return new Response(JSON.stringify({ error: validationErrors }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const response = new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: userData,
      }),
      { status: 200 }
    );

    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure=false`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
