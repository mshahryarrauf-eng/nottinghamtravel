"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { showAlert } from "@/components/common/mixin";
import { validateLogin } from "@/app/utils/validation";

export default function AdminLoginPage() {
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
      const res = await fetch("/api/admin/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showAlert("error", data.message || "Admin login failed!");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.data.admin));
      localStorage.setItem("adminToken", data.data.token);

      showAlert("success", "✅ Admin login successful!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      showAlert("error", "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Admin Dashboard Login 🔐
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
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

          {/* Submit */}
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
                Logging In...
              </>
            ) : (
              "Sign In as Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
