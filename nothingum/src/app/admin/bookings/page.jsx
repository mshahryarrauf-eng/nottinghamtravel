"use client";
import { useState, useEffect } from "react";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import DataTable from "react-data-table-component";
import { X } from "lucide-react";

// HOTEL COLUMNS (Summary Only)
const hotelColumns = (onDetails) => [
  { name: "Booking Code", selector: (row) => row.BookingCode },
  { name: "Status", selector: (row) => row.Status },
  {
    name: "Total ",
    selector: (row) =>
      `${row.currency || ""} ${row.Pricing?.FinalPrice?.toFixed(2)}`,
  },
  {
    name: "Actions",
    cell: (row) => (
      <button
        onClick={() => onDetails(row)}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Details
      </button>
    ),
  },
];

// PACKAGE COLUMNS (Summary Only)
const packageColumns = (onDetails) => [
  { name: "Booking ID", selector: (row) => row._id },
  { name: "Status", selector: (row) => row.status },
  {
    name: "Amount",
    selector: (row) => `${row.currency} ${" "} ${row.totalAmount}`,
  },
  {
    name: "Actions",
    cell: (row) => (
      <button
        onClick={() => onDetails(row)}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Details
      </button>
    ),
  },
];

export default function Booking() {
  const [activeTab, setActiveTab] = useState("hotels");
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // MODAL
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (activeTab === "hotels") fetchHotelBookings();
    if (activeTab === "packages") fetchPackageBookings();
  }, [activeTab]);

  // HOTEL BOOKINGS
  const fetchHotelBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/hotel-payments");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching hotel bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // PACKAGE BOOKINGS
  const fetchPackageBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/offers/book-offer");
      const data = await res.json();
      setPackages(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {["hotels", "flights", "packages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* HOTELS */}
      {activeTab === "hotels" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
            </div>
          ) : bookings.length === 0 ? (
            <p>No hotel bookings found.</p>
          ) : (
            <DataTable
              columns={hotelColumns((row) => setSelectedBooking(row))}
              data={bookings}
              pagination
              highlightOnHover
              responsive
              striped
            />
          )}
        </>
      )}

      {/* FLIGHTS */}
      {activeTab === "flights" && (
        <p>Flight bookings will be shown here (soon)</p>
      )}

      {/* PACKAGES */}
      {activeTab === "packages" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
            </div>
          ) : packages.length === 0 ? (
            <p>No package bookings found.</p>
          ) : (
            <DataTable
              columns={packageColumns((row) => setSelectedBooking(row))}
              data={packages}
              pagination
              highlightOnHover
              responsive
              striped
            />
          )}
        </>
      )}

      {/* ---------- MODAL ---------- */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            {/* CLOSE BUTTON */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedBooking(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Booking Details</h2>

            <div className="max-h-96 overflow-auto">
              {/* =================== HOTEL BOOKING DETAILS =================== */}
              {"BookingCode" in selectedBooking ? (
                <div className="space-y-4 p-4">
                  {/* Booking Summary */}
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">
                      Booking Summary
                    </h3>

                    <p>
                      <span className="font-medium">Booking Code:</span>{" "}
                      {selectedBooking.BookingCode}
                    </p>

                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                          selectedBooking.Status === "Confirmed"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {selectedBooking.Status}
                      </span>
                    </p>

                    <p>
                      <span className="font-medium">Total Price:</span>{" "}
                      {selectedBooking.Pricing?.FinalPrice?.toFixed(2)}{" "}
                      {selectedBooking.Pricing?.Currency}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">
                      Contact Details
                    </h3>

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedBooking.Email}
                    </p>

                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedBooking.PhoneNumber}
                    </p>
                  </div>

                  {/* Pricing Details */}
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">
                      Pricing Breakdown
                    </h3>

                    <p>
                      <span className="font-medium">Room Fare:</span>{" "}
                      {selectedBooking.Pricing.TotalTBOFare} USD
                    </p>

                    <p>
                      <span className="font-medium">Tax:</span>{" "}
                      {selectedBooking.Pricing.TotalTBOTax} USD
                    </p>

                    <p>
                      <span className="font-medium">Markup:</span>{" "}
                      {selectedBooking.Pricing.OurMarkupPrice} USD
                    </p>
                  </div>

                  {/* Guest Details */}
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      Guest Details
                    </h3>

                    {selectedBooking.CustomerDetails?.map((g, i) => (
                      <div
                        key={i}
                        className="border-b pb-2 mb-2 last:border-none"
                      >
                        <p>
                          <span className="font-medium">Name:</span> {g.Title}{" "}
                          {g.FirstName} {g.LastName}
                        </p>

                        <p>
                          <span className="font-medium">Type:</span> {g.Type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* =================== PACKAGE BOOKING DETAILS =================== */
                <div className="space-y-4 p-4">
                  {/* Contact Info */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Contact Information
                    </h3>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedBooking.contact.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedBooking.contact.phone}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Payment Details
                    </h3>
                    <p>
                      <span className="font-medium">Fare Type:</span>{" "}
                      {selectedBooking.fareType}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span>{" "}
                      {selectedBooking.amount} {selectedBooking.currency}
                    </p>
                    <p>
                      <span className="font-medium">Total Amount:</span>{" "}
                      {selectedBooking.totalAmount} {selectedBooking.currency}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                          selectedBooking.status === "succeeded"
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </p>
                  </div>

                  {/* Guest Details */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Guest Information
                    </h3>

                    {selectedBooking.guests.map((g, index) => (
                      <div
                        key={index}
                        className="border-b pb-2 mb-2 last:border-none last:mb-0 last:pb-0"
                      >
                        <p>
                          <span className="font-medium">Name:</span> {g.title}{" "}
                          {g.firstName} {g.lastName}
                        </p>
                        <p>
                          <span className="font-medium">Type:</span> {g.type}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Offer Reference Details */}
                  {selectedBooking.offerId && (
                    <div className="bg-gray-100 rounded-xl p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Offer Reference
                      </h3>

                      {selectedBooking.offerId.title && (
                        <p>
                          <span className="font-medium">Title:</span>{" "}
                          {selectedBooking.offerId.title}
                        </p>
                      )}

                      {selectedBooking.offerId.type && (
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {selectedBooking.offerId.type}
                        </p>
                      )}

                      {selectedBooking.offerId.destination && (
                        <p>
                          <span className="font-medium">Destination :</span>{" "}
                          {selectedBooking.offerId.destination}
                        </p>
                      )}
                      {selectedBooking.offerId.hotelName && (
                        <p>
                          <span className="font-medium">hotel Name :</span>{" "}
                          {selectedBooking.offerId.hotelName}
                        </p>
                      )}

                      {selectedBooking.offerId.airline && (
                        <p>
                          <span className="font-medium">Airline:</span>{" "}
                          {selectedBooking.offerId.airline}
                        </p>
                      )}

                      {selectedBooking.offerId.journeyType && (
                        <p>
                          <span className="font-medium">Journey:</span>{" "}
                          {selectedBooking.offerId.journeyType}
                        </p>
                      )}

                      {selectedBooking.offerId.dateFrom &&
                        selectedBooking.offerId.dateTo && (
                          <p>
                            <span className="font-medium">Dates:</span>{" "}
                            {new Date(
                              selectedBooking.offerId.dateFrom
                            ).toLocaleDateString("en-GB")}{" "}
                            -{" "}
                            {new Date(
                              selectedBooking.offerId.dateTo
                            ).toLocaleDateString("en-GB")}
                          </p>
                        )}

                      {selectedBooking.offerId.amount &&
                        selectedBooking.offerId.currency && (
                          <p>
                            <span className="font-medium">Price:</span>{" "}
                            {selectedBooking.offerId.amount}{" "}
                            {selectedBooking.offerId.currency}
                          </p>
                        )}

                      {/* Categories */}
                      {selectedBooking.offerId.category &&
                        selectedBooking.offerId.category.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Categories:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedBooking.offerId.category
                                .flatMap((cat) => {
                                  if (typeof cat === "string") {
                                    try {
                                      const parsed = JSON.parse(cat);
                                      if (Array.isArray(parsed)) return parsed;
                                    } catch {
                                      return [cat];
                                    }
                                  }
                                  return [cat];
                                })
                                .map((cleanCat, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    {cleanCat}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                      {selectedBooking.offerId.images?.length > 0 && (
                        <img
                          src={selectedBooking.offerId.images[0]}
                          alt={selectedBooking.offerId.title}
                          className="w-full h-40 object-cover mt-2 rounded-md"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
