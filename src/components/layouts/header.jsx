"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RegisterPage, LoginPage } from "@/components";
import { useAuth } from "@/app/utils/authContext";
import Swal from "sweetalert2";
import { showAlert } from "@/components/common/mixin";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import {
  FaHome,
  FaTag,
  FaPlane,
  FaRegClipboard,
  FaUserCircle,
} from "react-icons/fa";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineChevronDown,
} from "react-icons/hi";

const Header = ({ stickyOffset = "0px" }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMainLoading, setMainLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isLoggedIn } = useAuth();
  const { logout } = useAuth();
  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/special-offers", label: "Special Offers", icon: <FaTag /> },
    { href: "/religious-tone", label: "Religious Tone", icon: <FaPlane /> },
    {
      href: "/tailor-made-query",
      label: "Tailor Made Query",
      icon: <FaRegClipboard />,
    },
  ];

  const confirmLogout = async () => {
    return await Swal.mixin({
      customClass: {
        confirmButton: "bg-blue-600 text-white px-4 py-2 rounded-md",
        cancelButton: "bg-gray-300 text-black px-4 py-2 rounded-md ml-2",
      },
      buttonsStyling: false,
    }).fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#000",
    });
  };

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;

    try {
      setMainLoading(true);
      await logout();
      showAlert("success", "✅ You’ve been logged out successfully!");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Logout API error:", error);
      showAlert("error", "Something went wrong during logout!");
    } finally {
      setMainLoading(false);
    }
  };

  return (
    <>
      {isMainLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-100/50 backdrop-blur-sm">
          <LazyGlobeLoader />
        </div>
      )}
      <header
        className="z-50 bg-white dark:bg-black shadow-sm sticky"
        style={{ top: stickyOffset }}
      >
        <div className="relative flex w-full items-center px-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <img
              className="inline w-24 ltr:-ml-1 rtl:-mr-1 mb-1"
              src="/assets/Notigham-logo.png"
              alt="logo"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden ml-auto p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <HiOutlineMenuAlt3 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex ml-auto font-semibold lg:pr-6 text-black dark:text-white-dark items-center gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative flex items-center px-4 py-2 transition-all duration-300 ${
                      active
                        ? "text-primary font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary"
                    }`}
                  >
                    <span
                      className={`mr-2 text-lg transition-colors duration-300 ${
                        active ? "text-primary" : "group-hover:text-primary"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/80 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full ${
                        active ? "w-full" : ""
                      }`}
                    ></span>
                  </Link>
                </li>
              );
            })}

            {/* Profile / Login */}
            {/* {isLoggedIn ? (
              <li className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-all"
                >
                  <FaUserCircle className="text-2xl" />
                  <HiOutlineChevronDown
                    className={`transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 shadow-lg rounded-xl border dark:border-gray-700 py-2 z-50"
                    >
                      <Link
                        href="/profile/manage"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        onClick={() => setProfileOpen(false)}
                      >
                        Manage Profile
                      </Link>

                      <div>
                        <button
                          onClick={() => setBookingOpen((prev) => !prev)}
                          className="w-full flex justify-between items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                          <span>My Bookings</span>
                          <HiOutlineChevronDown
                            className={`transition-transform ${
                              bookingOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {bookingOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col ml-4 border-l border-gray-200 dark:border-gray-700"
                            >
                              <Link
                                href="/bookings/hotels"
                                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-all"
                                onClick={() => setProfileOpen(false)}
                              >
                                Hotels Booking
                              </Link>
                              <Link
                                href="/bookings/flights"
                                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-all"
                                onClick={() => setProfileOpen(false)}
                              >
                                Flights Booking
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li className="relative flex items-center">
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowRegisterModal(false);
                  }}
                  className={`group relative flex items-center px-2 py-2 transition-all duration-300 ${
                    showLoginModal
                      ? "text-primary font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  Login
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/80 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full ${
                      showLoginModal ? "w-full" : ""
                    }`}
                  ></span>
                </button>{" "}
                /
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setShowLoginModal(false);
                  }}
                  className={`group relative flex items-center px-2 py-2 transition-all duration-300 ${
                    showRegisterModal
                      ? "text-primary font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  Register
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/80 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full ${
                      showRegisterModal ? "w-full" : ""
                    }`}
                  ></span>
                </button>
              </li>
            )} */}
          </ul>
        </div>

        {/* ✅ MOBILE MENU DRAWER */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-[90]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="fixed right-0 top-0 w-72 h-full bg-white dark:bg-gray-900 shadow-lg z-[91] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <HiOutlineX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <ul className="space-y-4">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 text-lg ${
                            pathname === link.href
                              ? "text-primary font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:text-primary"
                          }`}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ✅ Mobile footer: Login/Profile */}
                {/* <div className="border-t pt-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile/manage"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-700 dark:text-gray-200 hover:text-primary mb-2"
                      >
                        Manage Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setShowRegisterModal(false);
                          setIsOpen(false);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setShowRegisterModal(true);
                          setShowLoginModal(false);
                          setIsOpen(false);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div> */}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ✅ Auth Modals (unchanged) */}
        <AnimatePresence>
          {showLoginModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginModal(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.25 }}
                className="fixed m-2 z-[101] inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 rounded-3xl p-8 sm:p-10 transition-all relative">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <HiOutlineX className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </button>
                  <LoginPage onClose={() => setShowLoginModal(false)} />
                  <div className="mt-4 text-center">
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setShowRegisterModal(true);
                        setShowLoginModal(false);
                      }}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRegisterModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRegisterModal(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.25 }}
                className="fixed m-2 z-[101] inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 rounded-3xl p-8 sm:p-10 transition-all relative">
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <HiOutlineX className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </button>

                  <RegisterPage onClose={() => setShowRegisterModal(false)} />
                  <div className="mt-4 text-center">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowRegisterModal(false);
                      }}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
