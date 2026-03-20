"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const mockAirlines = [
  {
    id: 1,
    title: "Qatar Airways",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/10197/10.jpg",
  },
  {
    id: 2,
    title: "Malaysia Airways",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/31728/Malayisa-Airlines.jpg",
  },
  {
    id: 3,
    title: "Etihad Airways",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/10198/9.jpg",
  },
  {
    id: 4,
    title: "Turkish Airlines",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/10199/8.jpg",
  },
  {
    id: 5,
    title: "Oman Air",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/31727/oman-air.jpg",
  },
  {
    id: 6,
    title: "Singapore Airlines",
    image:
      "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/specialOffer/10199/8.jpg",
  },
];

const AirLines = () => {
  return (
    <section className="px-2 lg:px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2 tracking-wide">
          Tailor Made Offers!
        </h1>
        <p className="text-gray-600 text-lg">Call Now or Book Online</p>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="px-4 md:px-10 cursor-pointer"
      >
        {mockAirlines.map((airline) => (
          <SwiperSlide key={airline.id}>
            <Link href={`/tripdetail/${airline.id}`}>
              <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500">
                {/* Airline Image */}
                <img
                  src={airline.image}
                  alt={airline.title}
                  className="w-full  object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

               
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AirLines;
