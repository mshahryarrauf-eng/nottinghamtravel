"use client";

import { useEffect } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  useEffect(() => {
    const hostname = window.location.hostname;
    if(hostname.startsWith("dashboard") || hostname.startsWith("admin")) {
      window.location.href = `${process.env.NEXT_PUBLIC_HOSTNAME}/admin/dashboard`;
    }
  }, []);
  return (
    <html lang="en">
      <body className="font-[var(--font-poppins)]">{children}</body>
    </html>
  );
}

