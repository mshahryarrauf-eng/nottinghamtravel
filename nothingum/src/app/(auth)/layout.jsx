"use client";
export default function AuthLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
          {children}
    </div>
  );
}
