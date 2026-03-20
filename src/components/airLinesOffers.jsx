"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const airlinesData = [
  {
    id: 1,
    name: "Qatar Airways",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 2,
    name: "Emirates",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 3,
    name: "Etihad Airways",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 4,
    name: "Turkish Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 5,
    name: "British Airways",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 6,
    name: "Singapore Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 7,
    name: "Lufthansa",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 8,
    name: "Air France",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 9,
    name: "Saudi Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 10,
    name: "Oman Air",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 11,
    name: "PIA",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 12,
    name: "Fly Dubai",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 13,
    name: "Kuwait Airways",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 14,
    name: "Air India",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 15,
    name: "Malaysia Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 16,
    name: "Thai Airways",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 17,
    name: "China Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 18,
    name: "Cathay Pacific",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 19,
    name: "KLM Royal Dutch",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
  {
    id: 20,
    name: "American Airlines",
    image: "https://nottinghamtravel.co.uk/images/Airlines/af.png",
  },
];

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const AirLinesOffers = () => {
  const groupedAirlines = chunkArray(airlinesData, 10);

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 tracking-wide mb-3">
          Airlines Offers
        </h2>
        <p className="text-gray-600 max-w-xl px-6 mx-auto">
          Discover exclusive flight deals and limited-time offers from top
          airlines around the world. Choose your preferred airline and book your
          next journey with unbeatable prices and comfort.
        </p>
      </div>

      <div className="space-y-10">
        {groupedAirlines.map((group, index) => (
          <Swiper
            key={index}
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={8}
            loop
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: index % 2 !== 0,
            }}
            allowTouchMove={true}
            className="px-2"
            breakpoints={{
              320: { slidesPerView: 3 },
              640: { slidesPerView: 5 },
              1024: { slidesPerView: 8 },
            }}
          >
            {group.map((airline) => (
              <SwiperSlide key={airline.id}>
                <Link
                  href={`/airlineoffer/${airline.id}`}
                  className="flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={airline.image}
                    alt={airline.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />
                  <h5 className="text-gray-700 text-xs sm:text-sm font-medium mt-1 text-center">
                    {airline.name}
                  </h5>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>
    </section>
  );
};

export default AirLinesOffers;
