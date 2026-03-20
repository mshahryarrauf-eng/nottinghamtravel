"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaPen,
  FaCommentDots,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { showAlert } from "@/components/common/mixin";
import LazyLoading from "@/components/common/lazyLoading";
import axios from "axios";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    try {
      setLoading(true);
      let response = await axios.post("/api/contact-us", formData);
      console.log(response);
      if (response.status === 201) {
        showAlert(
          "success",
          "Thank you! Your message has been sent successfully."
        );
      }
    } catch (error) {
      showAlert(
        "error",
        error.error || "An error occurred while sending your message."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LazyLoading />
      </div>
    );
  }
  return (
    <section className="bg-white text-gray-800 py-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Please don’t hesitate to contact us should you require any further
            assistance. Contact us by calling us or alternatively fill in the
            contact form below and one of our travel consultants will contact
            you at the earliest convenience.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between gap-5 text-gray-700">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
              <p>
                <span className="font-semibold text-green-600">
                  Head Office:
                </span>{" "}
                161 Radford Road, Hyson Green, Nottingham NG7 5EH
                <br />
                <span className="font-semibold text-green-600">
                  Bradford Branch:
                </span>{" "}
                830 Leeds Road BD3 9TX
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-600 text-xl" />
                <p>sales@nottinghamtravel.com</p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-600 text-xl" />
                <p>01159 78 78 99</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaPen className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <FaCommentDots className="absolute top-3 left-3 text-gray-400" />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
