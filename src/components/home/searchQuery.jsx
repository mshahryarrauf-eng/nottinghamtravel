"use client";
import { useState, useEffect } from "react";
import {
  FaPlane,
  FaHotel,
  FaSuitcase,
  FaClipboardList,
  FaCar,
  FaUmbrellaBeach,
  FaParking,
  FaConciergeBell,
  FaWalking,
  FaShieldAlt,
} from "react-icons/fa";
import {
  HotelSearch,
  FlightSearch,
  HotelFlightSearch,
  PackagesSearch,
  AirportParkingSearch,
  AirportHotelParkingSearch,
  AirportHotelsSearch,
  AirportLoungesSearch,
  AirportFastTrackSearch,
  OverseasAirportTransfersSearch,
  CarHireSearch,
  TravelInsuranceSearch,
  PortParkingHotelsSearch,
} from "./index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function SearchQueries() {
  const [activeTab, setActiveTab] = useState("flights");
  const [mounted, setMounted] = useState(false);

  const tabs = [
    {
      key: "flights",
      label: "Flights",
      icon: <FaPlane />,
      banner: "/assets/flight-banner.png",
    },
    {
      key: "hotels",
      label: "Hotels",
      icon: <FaHotel />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "hotelFlight",
      label: "Hotel + Flight",
      icon: <FaSuitcase />,
      banner: "/assets/hotel+flight.png",
    },
    {
      key: "packages",
      label: "Packages",
      icon: <FaClipboardList />,
      banner:
        "https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/ManageHome/leonard-cotte-R5scocnOOdM-unsplash.jpg",
    },
    {
      key: "airportParking",
      label: "Airport Parking",
      icon: <FaParking />,
      banner:
        "https://images.unsplash.com/photo-1630165356811-645a4914aaca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyJTIwcGFya3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      key: "airportHotelParking",
      label: "Airport Hotel & Parking",
      icon: <FaHotel className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "airportHotels",
      label: "Airport Hotels",
      icon: <FaHotel className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "airportLounges",
      label: "Airport Lounges",
      icon: <FaConciergeBell className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "airportFastTrack",
      label: "Airport Fast Track",
      icon: <FaWalking className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "overseasAirportTransfers",
      label: "Overseas Airport Transfers",
      icon: <FaCar className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "carHire",
      label: "Car Hire",
      icon: <FaCar className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "travelInsurance",
      label: "Travel Insurance",
      icon: <FaShieldAlt className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
    {
      key: "portParkingHotels",
      label: "Port Parking & Hotels",
      icon: <FaUmbrellaBeach className="inline-block mr-2" />,
      banner: "/assets/Hotels.png",
    },
  ];

  useEffect(() => setMounted(true), []);

  const renderTabContent = (key) => {
    switch (key) {
      case "flights":
        return <FlightSearch />;
      case "hotels":
        return <HotelSearch />;
      case "hotelFlight":
        return <HotelFlightSearch />;
      case "packages":
        return <PackagesSearch />;
      case "airportParking":
        return <AirportParkingSearch />;
      case "airportHotelParking":
        return <AirportHotelParkingSearch />;
      case "airportHotels":
        return <AirportHotelsSearch />;
      case "airportLounges":
        return <AirportLoungesSearch />;
      case "airportFastTrack":
        return <AirportFastTrackSearch />;
      case "overseasAirportTransfers":
        return <OverseasAirportTransfersSearch />;
      case "carHire":
        return <CarHireSearch />;
      case "travelInsurance":
        return <TravelInsuranceSearch />;
      case "portParkingHotels":
        return <PortParkingHotelsSearch />;
      default:
        return null;
    }
  };

  if (!mounted) return null;
  const currentBanner = tabs.find((t) => t.key === activeTab)?.banner;

  return (
    <section
      className="relative h-screen transition-all duration-500"
      style={{
        backgroundImage: `url(${currentBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="m-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="absolute top-5 max-w-5xl md:max-w-6xl mx-auto z-10 px-4 h-28"
        >
          {tabs.map((tab) => (
            <SwiperSlide key={tab.key}>
              <button
                className={`flex flex-col items-center w-full  justify-center gap-1 p-2 rounded-sm font-semibold uppercase cursor-pointer  ${
                  activeTab === tab.key
                    ? "bg-[#23AFEC] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute top-36 z-10 w-full px-4">
        {renderTabContent(activeTab)}
      </div>
    </section>
  );
}