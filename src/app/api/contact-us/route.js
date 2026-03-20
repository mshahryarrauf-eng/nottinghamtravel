import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import { validateContact } from "../../utils/validation";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone, subject, message } = await req.json();
    const { valid, error } = validateContact({
      name,
      email,
      phone,
      subject,
      message,
    });
    if (!valid) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });
    const response = new Response(
      JSON.stringify({
        message: "Contact registered successfully",
        contact: contact,
      }),
      { status: 201 }
    );
    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  await connectDB();
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB();
  try {
    const data = await request.json();
    const id = data.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const deletedQuery = await Contact.findByIdAndDelete(id);
    if (!deletedQuery) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}