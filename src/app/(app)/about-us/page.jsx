"use client";
import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="bg-white text-gray-800 py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          About Us
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600">
          One of the Top Travel Operators in the UK
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 leading-relaxed text-justify">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-semibold text-gray-900">
            Nottingham Travel UK Ltd
          </span>{" "}
          is a travel operator rated as one of the top travel providers within
          the East Midlands, where all of our consumers are ATOL protected.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Consumers can book with us in confidence as we are a fully accredited{" "}
          <span className="font-medium text-gray-900">IATA</span> and{" "}
          <span className="font-medium text-gray-900">ATOL</span> licensed travel
          organisation. Our core tenet is to deliver outstanding service – it is
          at the heart of our customer care. Our ability to not only meet but
          exceed client and traveller expectations is what makes us one of the
          most prominent travel benefactors in the East Midlands. Here at
          Nottingham Travel UK Ltd, we have a reputation for service that is
          second to none.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We are your gateway to a perfect tailor-made holiday, providing great
          value all-inclusive holiday packages as well as flight and hotel-only
          deals. Nottingham Travel is one of the main consolidators in the East
          Midlands for all traditional airlines.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          We offer flight bookings with many airlines to destinations all around
          the world. You can now get the ball rolling by selecting flight or
          hotel-only deals and fully inclusive holidays using our website. Our
          platform is tailor-made to compare flights and hotels for you using
          your search criteria to find the best prices.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          It searches through low-cost airlines and traditional providers,
          making it an easier process for you to select the best deal. Book with
          confidence — you can now save time and money, compare flights and
          hotels, or combine them for a complete travel experience.
        </motion.p>
      </div>

      <div className="max-w-5xl mx-auto text-center mt-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-2xl font-semibold text-gray-900"
        >
          Book With Confidence, Travel With Ease
        </motion.h2>
        <p className="mt-4 text-gray-600">
          Nottingham Travel UK Ltd — where exceptional service meets
          unforgettable journeys.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
