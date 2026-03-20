"use client";

import { useState } from "react";
import { useAuth } from "@/app/utils/authContext";
import { Loader2 } from "lucide-react";
import { showAlert } from "@/components/common/mixin";
import { validateLogin } from "@/app/utils/validation";

export default function LoginPage({ onClose }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("error", data.error || "Login failed!");
        return;
      }

      login(data.user, data.token);
      showAlert("success", "✅ Login successful!");

      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error(err);
      showAlert("error", "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border ${
                errors.email ? "border-red-500" : "border-transparent"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border ${
                errors.password ? "border-red-500" : "border-transparent"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-transform hover:scale-[1.02] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
