"use client";

import Header from "../../components/layouts/header";
import Footer from "../../components/layouts/footer";
import ScrollToTop from "../../components/layouts/scroll-to-top";
import TopBar from "../../components/layouts/TopBar";
import { AuthProvider } from "../utils/authContext";
export default function AppLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <ScrollToTop />

  <AuthProvider>
      {/* TopBar */}
      <TopBar />
          <Header />
          {children}
        </AuthProvider>
      {/* Header sticky */}
      {/* <Header topOffset="36px" />

      <main className="flex-1 bg-gradient-to-b from-white to-blue-50">
         <AuthProvider>{children}</AuthProvider>
        </main> */}

      <Footer />
    </div>
  );
}
