"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const mockcounties = [
  {
    id: 1,
    name: "Qatar",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/BD.jpg",
  },
  {
    id: 2,
    name: "Malaysia",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/FI.jpg",
  },
  {
    id: 3,
     name: "Qatar",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/BD.jpg",
  },
  {
    id: 4,
    name: "Malaysia",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/FI.jpg",
  },
  {
    id: 5,
    name: "Qatar",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/BD.jpg",
  },
  {
    id: 6,
    name: "Malaysia",
    image: "https://nottinghamtravel.co.uk/images/CountryMaster/FI.jpg",
  },
];

const CountryOffers = () => {
  return (
    <section className="px-2 lg:px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2 tracking-wide">
          Country Offers
        </h1>
        <p className="text-gray-600 max-w-xl px-6 mx-auto">
          Explore exclusive flight offers from top destinations around the
          world. Click your preferred country to discover the best travel deals.
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="px-4 md:px-10 cursor-pointer"
      >
        {mockcounties.map((country, index) => (
          <SwiperSlide key={index}>
            <Link href={`/countryoffer/${country.id}`}>
              <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500">
                {/* Country Background Image */}
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Country Name Centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 py-4 w-full">
                    <h3 className="text-white text-xl font-semibold text-center tracking-wide">
                      {country.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CountryOffers;
