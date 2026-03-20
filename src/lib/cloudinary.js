// src/lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Automatically uses CLOUDINARY_URL from .env.local
cloudinary.config({
  secure: true,
});

/**
 * Upload a single image (supports both File & Buffer objects)
 * @param {File|Buffer|Object} file - File object (browser) or file buffer (Postman/Formidable)
 * @param {string} folder
 */
export async function uploadSingleImage(file, folder = "uploads") {
  try {
    let buffer;

    // ✅ Case 1: File object from browser
    if (typeof file.arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
    // ✅ Case 2: Postman or Formidable (already Buffer or has buffer)
    else if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file.buffer) {
      buffer = file.buffer;
    } else {
      throw new Error("Invalid file format for Cloudinary upload");
    }

    // ✅ Upload using Cloudinary’s stream uploader
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Single Upload Error:", error);
    throw new Error("Image upload failed");
  }
}

/**
 * Upload multiple images
 * @param {Array<File|Buffer>} files
 * @param {string} folder
 */
export async function uploadMultipleImages(files, folder = "uploads") {
  try {
    const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Cloudinary Multi Upload Error:", error);
    throw new Error("Multiple image upload failed");
  }
}

/**
 * Delete image by Cloudinary public ID
 * @param {string} publicId
 */
export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return false;
  }
}

export default cloudinary;
