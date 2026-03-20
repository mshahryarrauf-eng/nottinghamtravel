"use client";

import { useState } from "react";
import { validateSignup } from "@/app/utils/validation";
import { Loader2 } from "lucide-react";
import { showAlert } from "@/components/common/mixin";
import { useAuth } from "@/app/utils/authContext";
export default function SignupPage({ onClose }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignup(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("error", data.error || "Signup failed!");
        return;
      }
      login(data.user, data.token);

      showAlert("success", "✅ Signup successful!");

      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error(err);
      showAlert("error", "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full flex justify-center items-center ">
      <div className="w-full ">
        <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Create an Account ✨
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-3 w-full">
            {/* LEFT SIDE — Name + Email */}
            <div className="space-y-6 w-full sm:w-1/2">
              <div className="flex flex-col min-h-[100px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
                <p
                  className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${
                    errors.name ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.name || "placeholder"}
                </p>
              </div>
              <div className="flex flex-col min-h-[100px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
                <p
                  className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${
                    errors.email ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.email || "placeholder"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE — Phone + Password */}
            <div className="space-y-6 w-full sm:w-1/2 mt-6 sm:mt-0">
              <div className="flex flex-col min-h-[100px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
                <p
                  className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${
                    errors.phone ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.phone || "placeholder"}
                </p>
              </div>

              <div className="flex flex-col min-h-[100px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
                <p
                  className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${
                    errors.password ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.password || "placeholder"}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                <span>Loading...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
