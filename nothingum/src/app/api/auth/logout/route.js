import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  response.headers.append(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure=false"
  );

  return response;
}
