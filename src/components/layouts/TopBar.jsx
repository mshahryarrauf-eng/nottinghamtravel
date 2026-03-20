"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="hidden lg:block  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm py-1">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
        {/* Left Side: Phone Number */}
        <div className="flex items-center space-x-4">
          <span>📞 01159 78 78 99</span>
        </div>

        {/* Right Side: Email + Links + Social Icons */}
        <div className="flex items-center space-x-6">
          {/* Email */}
          <span className="hover:text-green-600 transition">
            ✉ sales@nottinghamtravel.com
          </span>

          {/* Links */}
          <a href="/contact-us" className="hover:text-green-600 transition">
            Contact Us
          </a>
          <a href="about-us" className="hover:text-green-600 transition">
            About Us
          </a>

          {/* Social Icons */}
          <div className="flex space-x-2">
            <a  target="_blank" href="https://www.facebook.com/nottinghamtraveluk" className="hover:text-green-600 transition">
              <FaFacebookF />
            </a>
            <a target="_blank" href="http://https//twitter.com/NottsTravel" className="hover:text-green-600 transition">
              <FaTwitter />
            </a>
         
            <a target="_blank" href="https://www.instagram.com/nottinghamtravel" className="hover:text-green-600 transition">
              <FaInstagram />
            </a>
            <a target="_blank" href="https://www.youtube.com/watch?v=L7m0_lgxlak&feature=youtu.be" className="hover:text-green-600 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
