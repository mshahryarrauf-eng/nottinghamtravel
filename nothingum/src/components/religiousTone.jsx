"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import LeazyLoading from "@/components/common/lazyLoading";
import TiltedCard from "@/components/common/tiltedCrad";

const OFFER_TYPES = ["Flight", "Hotel", "Package"];

// ------------------- OFFER CARD -------------------
function OfferCard({ offer }) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/offer-details/${offer.slug}`);
  };
  return (
    <TiltedCard
      containerHeight="450px"
      containerWidth=""
      scaleOnHover={1.04}
      rotateAmplitude={8}
      overlayContent={
        <div
          key={offer._id}
          className="bg-[#e9f0ff] relative rounded-2xl shadow-md overflow-hidden flex flex-col border border-blue-100 lg:w-full"
        >
          <div className="relative">
            {offer.images?.length > 0 && (
              <img
                src={offer.images[0]}
                alt={offer.title || "Offer image"}
                className="w-full h-44 object-cover"
              />
            )}
            {offer.title && (
              <div className="absolute top-0 left-0 w-full bg-black/40 text-white text-center py-3 font-semibold text-sm">
                {offer.title}
              </div>
            )}
          </div>

          <div className="bg-[#ffffff] text-center py-4 flex flex-col items-center">
            {offer.type === "flight" && offer.destination && (
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {offer.destination}
              </h3>
            )}
            {offer.hotelName && (
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {offer.hotelName}
              </h3>
            )}
            {offer.logo && (
              <img
                src={offer.logo}
                alt="Airline logo"
                className="w-6 h-6 my-1"
              />
            )}
            {offer.airline && (
              <p className="font-semibold text-gray-700">{offer.airline}</p>
            )}
            {offer.cabinClass && (
              <p className="text-gray-600 text-sm mb-2">{offer.cabinClass}</p>
            )}
            {offer.rating && (
              <div className="flex justify-center mb-2">
                {[...Array(Math.round(offer.rating))].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-yellow-400"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.457a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.457a1 1 0 00-1.175 0l-3.38 2.457c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
              </div>
            )}

            <div className="w-3/4 border-t border-gray-300 my-2"></div>
            <p className="text-gray-600 text-sm tracking-widest">
              STARTING FROM
            </p>
            {offer.amount && offer.currency && (
              <p className="text-3xl font-bold text-blue-900 my-1">
                {offer.currency} {offer.amount}
              </p>
            )}
            {offer.dateFrom && offer.dateTo && (
              <p className="text-gray-600 text-sm">
                {new Date(offer.dateFrom).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}{" "}
                -{" "}
                {new Date(offer.dateTo).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </p>
            )}
          </div>

          <button
            onClick={handleViewDetail}
            className="bg-green-600 cursor-pointer  text-white py-3 text-lg font-semibold hover:bg-green-600 transition w-full rounded-b-2xl"
          >
            VIEW DETAIL
          </button>
        </div>
      }
    />
  );
}

// ------------------- MAIN COMPONENT -------------------
export default function ReligiousTone() {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      type: "",
      destination: "",
      month: "",
      // category removed
    },
  });

  const [allOffers, setAllOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        const activeOffers = (data.offers || data || []).filter(
          (offer) => offer.active === true
        );

        const parsedOffers = activeOffers.map((offer) => {
          let categories = offer.category || [];
          if (categories.length === 1 && typeof categories[0] === "string") {
            try {
              const parsed = JSON.parse(categories[0]);
              if (Array.isArray(parsed)) categories = parsed;
            } catch (err) {
              categories = [];
            }
          }
          return { ...offer, category: categories };
        });

        setAllOffers(parsedOffers);
        setFilteredOffers(parsedOffers);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const onSubmit = (filters) => {
    const hasFilter = filters.type || filters.destination || filters.month;
    setFiltersApplied(hasFilter);

    const filtered = allOffers.filter((offer) => {
      const matchType = filters.type ? offer.type === filters.type : true;
      const matchDestination = filters.destination
        ? offer.destination
            .toLowerCase()
            .includes(filters.destination.toLowerCase())
        : true;
      const matchMonth = filters.month
        ? (() => {
            const [year, month] = filters.month.split("-");
            const offerDate = new Date(offer.dateFrom);
            return (
              offerDate.getFullYear() === parseInt(year) &&
              offerDate.getMonth() + 1 === parseInt(month)
            );
          })()
        : true;

      return matchType && matchDestination && matchMonth;
    });

    setFilteredOffers(filtered);
  };

  const clearFilters = () => {
    reset();
    setFilteredOffers(allOffers);
    setFiltersApplied(false);
  };

  // -------- ONLY RELIGIOUS PACKAGES --------
  // -------- ONLY RELIGIOUS OFFERS --------
  const religiousOffers = filteredOffers.filter((offer) => {
    // Parse category string if needed
    let categories = offer.category || [];
    if (categories.length === 1 && typeof categories[0] === "string") {
      try {
        const parsed = JSON.parse(categories[0]);
        if (Array.isArray(parsed)) categories = parsed;
      } catch (err) {
        categories = [];
      }
    }

    return categories.includes("Religious");
  });

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-gradient-to-r from-green-400 p-6 to-blue-500 text-white text-center rounded-b-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          {/* Offer Type */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-black">Offer Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="border border-black rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black "
                >
                  <option className="text-black" value="">
                    Please select
                  </option>
                  {OFFER_TYPES.map((t) => (
                    <option className="text-black" key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Destination */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-black">Destination</label>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Please select"
                  className="border border-black rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black "
                />
              )}
            />
          </div>

          {/* Month */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-black">Month</label>
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <input
                  type="month"
                  {...field}
                  className="border border-black rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black "
                />
              )}
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-3 flex justify-end mt-2 gap-2">
            {filtersApplied && (
              <button
                type="button"
                onClick={clearFilters}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Clear Filters
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Offers Section */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LeazyLoading />
        </div>
      ) : (
        <div className="mx-6 my-14">
          {religiousOffers.length > 0 ? (
            <>
              <h2 className="text-4xl font-extrabold my-8 text-black text-center mb-6 animate-fadeIn">
                Religious Packages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {religiousOffers.map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-full py-10 text-center text-gray-600">
              <p className="mb-5">
                No religious packages match your selected filters.
              </p>
              {filtersApplied && (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
