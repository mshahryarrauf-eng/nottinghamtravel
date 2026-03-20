"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function ManageProfile() {
  const [formData, setFormData] = useState({
    fullName: "Bilal Ahmad",
    email: "bilal@example.com",
    phone: "+92 300 1234567",
    country: "Pakistan",
    profileImage:
      "https://images.unsplash.com/photo-1603415526960-f7e0328b1a8e?w=200&h=200&fit=crop",
  });

  const [imagePreview, setImagePreview] = useState(formData.profileImage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData({ ...formData, profileImage: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    alert("✅ Profile data logged in console!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">
            Manage Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Keep your account information up to date
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <img
              src={
                imagePreview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-all"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Tap camera to {imagePreview ? "change" : "add"} photo
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-transparent"
        >
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "text" },
            { label: "Country", name: "country", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white px-1 py-2 focus:outline-none transition-all"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex justify-center mt-10">
            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
