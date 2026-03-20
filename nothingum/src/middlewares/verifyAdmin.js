import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ✅ Verify Admin Token Middleware
 * @param {Request} req - Next.js API request
 * @returns {Object|null} Returns decoded admin payload or null if unauthorized
 */
export async function verifyAdmin(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    // 🧾 Extract and clean token
    const token = authHeader.replace("Bearer ", "").trim();

    // 🔐 Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🧠 Check admin role
    if (decoded.role !== "admin") return null;

    return decoded;
  } catch (error) {
    console.error("❌ Admin token verification failed:", error.message);
    return null;
  }
}
