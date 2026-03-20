import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TailormadeQuery from '@/models/tailorMadeQuery';

// Create new query
export async function POST(request) {
  await connectDB();
  try {
    const data = await request.json();
    const newQuery = await TailormadeQuery.create(data);
    return NextResponse.json({ success: true, data: newQuery }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// Get all queries
export async function GET() {
  await connectDB();
  try {
    const queries = await TailormadeQuery.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: queries });
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

    const deletedQuery = await TailormadeQuery.findByIdAndDelete(id);
    if (!deletedQuery) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
