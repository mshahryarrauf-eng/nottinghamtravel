import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/models/offer";
import { verifyAdmin } from "@/middlewares/verifyAdmin";
import { uploadSingleImage, uploadMultipleImages } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

    await connectDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData);
    const files = formData.getAll("images");
    let imageUrls = [];

    if (files && files.length > 0) {
      if (files.length === 1) {
        const buffer = Buffer.from(await files[0].arrayBuffer());
        const url = await uploadSingleImage(buffer, "offers");
        imageUrls.push(url);
      } else {
        imageUrls = await uploadMultipleImages(files, "offers");
      }
    }

    if (data.category) {
      data.category = Array.isArray(data.category) ? data.category : [data.category];
    } else {
      data.category = [];
    }

    const offer = await Offer.create({
      ...data,
      images: imageUrls,
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error) {
    console.error("Offer POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

    await connectDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData);
    const { _id } = data;

    if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

    const files = formData.getAll("images");
    let newImageUrls = [];
    if (files && files.length > 0) newImageUrls = await uploadMultipleImages(files, "offers");

    let existingImages = [];
    if (data.existingImages) existingImages = Array.isArray(data.existingImages) ? data.existingImages : [data.existingImages];

    const finalImages = [...existingImages, ...newImageUrls];
    delete data._id;
    delete data.images;
    delete data.existingImages;

    if (data.category) {
      data.category = Array.isArray(data.category) ? data.category : [data.category];
    } else {
      data.category = [];
    }

    const updatedOffer = await Offer.findByIdAndUpdate(_id, { ...data, images: finalImages }, { new: true, runValidators: true });

    if (!updatedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    return NextResponse.json({ success: true, offer: updatedOffer }, { status: 200 });
  } catch (error) {
    console.error("Offer PUT Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update offer" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const offer = await Offer.findOne({ slug });
      if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      return NextResponse.json({ success: true, offer }, { status: 200 });
    }

    const offers = await Offer.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, offers });
  } catch (error) {
    console.error("Offer GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

    await connectDB();
    const { _id } = await req.json();

    if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

    const deletedOffer = await Offer.findByIdAndDelete(_id);
    if (!deletedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Offer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Offer DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete offer" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

    await connectDB();
    const { _id, active } = await req.json();

    if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

    const updatedOffer = await Offer.findByIdAndUpdate(_id, { active }, { new: true });

    if (!updatedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: `Offer ${active ? "activated" : "deactivated"} successfully`, offer: updatedOffer }, { status: 200 });
  } catch (error) {
    console.error("Offer PATCH Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update offer status" }, { status: 500 });
  }
}
