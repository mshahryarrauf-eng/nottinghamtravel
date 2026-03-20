"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ListChecks,
  Briefcase,
  MessagesSquare,
  Tags,
  Users,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const info = localStorage.getItem("admin");
    if (!info) {
      router.push("/admin-login");
    } else {
      try {
        const parsed = JSON.parse(info);
        if (parsed.role !== "admin") {
          router.push("/admin-login");
        } else {
          setAdmin(parsed);
        }
      } catch {
        router.push("/admin-login");
      }
    }
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Markups", href: "/admin/markups", icon: Tags },
    { name: "Bookings", href: "/admin/bookings", icon: Briefcase },
    {
      name: "Tailer Made Queries",
      href: "/admin/tailer-made-queries",
      icon: ListChecks,
    },
    { name: "Manage Offers", href: "/admin/offers", icon: MessagesSquare },
    { name: "User Queries", href: "/admin/user-queries", icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ---------- SIDEBAR (DESKTOP + MOBILE) ---------- */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#2A7B9B] text-white shadow-lg transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 md:translate-x-0`}
      >
        {/* ---------- SIDEBAR CLOSE BUTTON (MOBILE) ---------- */}
        {sidebarOpen && (
          <button
            className="md:hidden fixed top-4 right-4 z-50 text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={26} />
          </button>
        )}
        {/* Logo */}
        <div className="flex items-center pl-7 py-6 border-b border-white/20">
          <img src="/assets/Notigham-logo.png" className="h-16" alt="logo" />
        </div>

        {/* Navigation */}
        <nav className="px-4 mt-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm
                  ${
                    isActive
                      ? "bg-white text-[#2A7B9B]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Admin User + Logout */}
        <div className="absolute bottom-0 w-full px-5 py-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={admin?.avatar || "/assets/profile-default.jpg"}
              className="w-10 h-10 rounded-full border border-white"
              alt="Avatar"
            />
            <div>
              <p className="font-semibold">{admin?.name || "Admin"}</p>
              <p className="text-xs opacity-80">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ---------- MOBILE TOP BAR ---------- */}
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center bg-[#2A7B9B] text-white px-4 shadow-md z-30">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-white/20">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <img
            src="/assets/Notigham-logo.png"
            className="h-16 ml-7"
            alt="logo"
          />
        </div>
      </header>

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <main className="flex-1 md:ml-64 mt-14 md:mt-0 p-4 w-full overflow-hidden">
        {/* ---------- BREADCRUMB ---------- */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 flex flex-wrap items-center">
            {(() => {
              const segments = pathname.split("/").filter(Boolean);
              const last = segments[segments.length - 1];

              const formatted = last
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <span className="font-semibold text-gray-800 text-2xl my-2">
                  {formatted}
                </span>
              );
            })()}
          </nav>
        </div>

        {children}
      </main>
    </div>
  );
}
