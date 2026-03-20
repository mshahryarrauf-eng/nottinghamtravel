"use client";
import { useEffect, useState } from "react";
import { FaFilter, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import { CalendarDays, Globe2, Bookmark } from "lucide-react";
import { showAlert } from "@/components/common/mixin";
import { loadStripe } from "@stripe/stripe-js";
import Stepper, { Step } from "./common/steper";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SpotlightCard from "./common/spootLightCard";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

function BookingStep({ selectedOffer, contact, guests, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsPaying(true);
    const totalAmount =
      selectedOffer.fareType === "Per Person"
        ? selectedOffer.amount * guests.length
        : selectedOffer.amount;

    // 1️⃣ Create booking & get clientSecret
    const res = await fetch("/api/offers/book-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact,
        guests,
        offerId: selectedOffer._id,
        amount: selectedOffer.amount,
        totalAmount,
        currency: selectedOffer.currency || "usd",
        fareType: selectedOffer.fareType,
      }),
    });

    const data = await res.json();

    if (!data.clientSecret) {
      showAlert("error", "Payment initialization failed.");
      setIsPaying(false);
      return;
    }

    // 2️⃣ Confirm card payment
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card, billing_details: { email: contact.email } },
    });

    // 3️⃣ Update booking status
    const status = result.error ? "failed" : "succeeded";

    await fetch("/api/offers/book-offer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: data.booking._id,
        status,
      }),
    });

    if (result.error) {
      showAlert("error", "Payment failed: " + result.error.message);
    } else {
      showAlert("success", "Payment successful!");
      onClose();
      // setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enter Card Details</h3>
      <div className="border p-4 rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        onClick={handlePayment}
        disabled={!stripe || !elements || isPaying}
        className=" w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Pay Total {selectedOffer.currency}{" "}
        {selectedOffer.fareType === "Per Person"
          ? selectedOffer.amount * guests.length
          : selectedOffer.amount}
      </button>
    </div>
  );
}

function GuestCard({
  index,
  guest,
  updateGuest,
  removeGuest,
  errors,
  setErrors,
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="border p-4 rounded-lg bg-gray-50 mb-2">
      {/* Header with toggle */}
      <div className="flex justify-between items-center mb-2 cursor-pointer">
        <h3 className="font-medium text-gray-700">Guest {index + 1}</h3>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeGuest(index)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            {isOpen ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* Guest fields */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <select
              value={guest.title}
              onChange={(e) => updateGuest(index, "title", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            >
              <option>Mr</option>
              <option>Ms</option>
              <option>Mrs</option>
              <option>Dr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={guest.firstName}
              onChange={(e) => {
                updateGuest(index, "firstName", e.target.value);
                if (errors[`firstName${index}`])
                  setErrors((prev) => ({ ...prev, [`firstName${index}`]: "" }));
              }}
              placeholder="First Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            {errors[`firstName${index}`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`firstName${index}`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={guest.lastName}
              onChange={(e) => {
                updateGuest(index, "lastName", e.target.value);
                if (errors[`lastName${index}`])
                  setErrors((prev) => ({ ...prev, [`lastName${index}`]: "" }));
              }}
              placeholder="Last Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            {errors[`lastName${index}`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`lastName${index}`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={guest.type}
              onChange={(e) => updateGuest(index, "type", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            >
              <option>Adult</option>
              <option>Child</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
export default function PackagesDetails() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    fareType: "All",
    priceRange: [0, 5000],
  });
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem("packages");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPackages(parsed?.data || parsed || []);
    }
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesFareType =
      filters.fareType === "All" || pkg.fareType === filters.fareType;
    const matchesPrice =
      pkg.amount >= filters.priceRange[0] &&
      pkg.amount <= filters.priceRange[1];
    return matchesFareType && matchesPrice;
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [errors, setErrors] = useState({});

  const [contact, setContact] = useState({ phone: "", email: "" });
  const [guests, setGuests] = useState([
    { title: "Mr", firstName: "", lastName: "", type: "Adult" },
  ]);

  const addGuest = () =>
    setGuests([
      ...guests,
      { title: "Mr", firstName: "", lastName: "", type: "Adult" },
    ]);

  const removeGuest = (index) =>
    setGuests(guests.filter((_, i) => i !== index));
  const updateGuest = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handleSteps = (step) => {
    let stepErrors = {};

    switch (step) {
      case 1:
        if (!contact.phone.trim()) stepErrors.phone = "Phone is required";
        if (!contact.email.trim()) stepErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(contact.email))
          stepErrors.email = "Invalid email address";
        break;

      case 2:
        guests.forEach((g, i) => {
          if (!g.firstName.trim())
            stepErrors[`firstName${i}`] = "First Name required";
          if (!g.lastName.trim())
            stepErrors[`lastName${i}`] = "Last Name required";
        });
        break;
    }

    setErrors(stepErrors);

    return Object.keys(stepErrors).length === 0;
  };

  const bookNow = (pkg) => {
    setSelectedOffer(pkg);
    setShowModal(true);
  };
  if (!packages.length)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
      </div>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <div className="relative flex h-full gap-5">
        {isFilterOpen && (
          <div
            className="absolute z-10 h-full w-full bg-black/60"
            onClick={() => setIsFilterOpen(false)}
          ></div>
        )}

        <div
          className={`absolute top-0 left-0 z-20 h-full w-[260px] p-5 bg-white shadow-md transition-transform duration-300 overflow-y-auto rounded-r-md
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              type="button"
              className="text-gray-500 hover:text-primary"
              onClick={() => setIsFilterOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <aside className="space-y-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fare Type
              </label>
              <select
                value={filters.fareType}
                onChange={(e) =>
                  setFilters({ ...filters, fareType: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              >
                <option>All</option>
                <option>Per Person</option>
                <option>Total</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price Range ({packages[0]?.currency || "USD"}{" "}
                {filters.priceRange[0]} - {filters.priceRange[1]})
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ],
                  })
                }
                className="w-full"
              />
            </div>
          </aside>
        </div>

        <div className="flex-1 panel overflow-auto p-5">
          <button
            type="button"
            className="flex items-center gap-2 mb-4 text-primary"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="text-lg" />
            <span>Filters</span>
          </button>

          <section className="space-y-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-xl shadow p-5">
                <div className="flex flex-col gap-8">
                  <div className="relative w-full h-full gap-8 md:gap-4 justify-around md:flex-row flex flex-col overflow-hidden rounded-2xl">
                    <div className="w-full md:max-w-[60%] ">
                      {pkg.images && pkg.images.length > 1 ? (
                        <Slider {...sliderSettings}>
                          {pkg.images.map((img, idx) => (
                            <div key={idx} className="">
                              <img
                                src={img}
                                alt={`${pkg.title} - ${idx}`}
                                className="w-full w md:h-[320px]  object-cover rounded-2xl"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : pkg.images && pkg.images.length === 1 ? (
                        <img
                          src={pkg.images[0]}
                          alt={pkg.title}
                          className="w-full w md:h-[340px]  object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          No Images Available
                        </div>
                      )}
                    </div>
                    <div className="w-full md:w-[40%] ">
                      <SpotlightCard
                        className="custom-spotlight-card  bg-white/80"
                        spotlightColor="rgba(0, 229, 255, 0.2)"
                      >
                        <div>
                          <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b">
                            <Bookmark className="text-blue-600" size={20} />
                            <h2 className="font-semibold text-gray-800 text-lg">
                              SUMMARY
                            </h2>
                          </div>
                          <div className="p-5 space-y-4">
                            <h3 className="text-center text-lg font-semibold text-gray-900">
                              {pkg.title}
                            </h3>
                            <div className="flex items-start gap-3 text-gray-700">
                              <CalendarDays
                                size={20}
                                className="mt-1 text-black"
                              />
                              <p className="text-sm">
                                {new Date(pkg.dateFrom).toLocaleDateString()} -{" "}
                                {new Date(pkg.dateTo).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-start gap-3 text-gray-700">
                              <Globe2 size={20} className="mt-1 text-black" />

                              <div>
                                <p className="font-medium text-sm">Details</p>

                                {pkg.type === "Flight" ? (
                                  <div className="text-sm text-gray-600 space-y-1">
                                    {pkg.airline && (
                                      <p>
                                        <strong>Airline:</strong> {pkg.airline}
                                      </p>
                                    )}
                                    {pkg.journeyType && (
                                      <p>
                                        <strong>Journey:</strong>{" "}
                                        {pkg.journeyType}
                                      </p>
                                    )}
                                    {pkg.cabinClass && (
                                      <p>
                                        <strong>Cabin:</strong> {pkg.cabinClass}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-600">
                                    {pkg.cabinClass
                                      ? `${pkg.cabinClass}, `
                                      : ""}
                                    {pkg.hotelName || ""}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="w-1/2 bg-gray-100 p-4 flex flex-col justify-center">
                              <p className="text-xs text-gray-500">
                                Starting From
                              </p>
                              <p className="text-2xl font-bold text-black">
                                {pkg.currency} {pkg.amount}
                              </p>
                              <p className="text-xs text-gray-500">
                                / {pkg.fareType}
                              </p>
                            </div>
                            <div
                              onClick={() => bookNow(pkg)}
                              className="w-1/2 bg-green-500 flex items-center justify-center"
                            >
                              <button className="border lg:border-white text-white px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-green-600 transition">
                                BOOK NOW
                              </button>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {pkg.description && (
                      <div className="text-gray-600 text-sm mb-2">
                        <p
                          className={`transition-all overflow-hidden ${
                            expandedDesc[pkg._id] ? "max-h-96" : "max-h-16"
                          }`}
                          dangerouslySetInnerHTML={{ __html: pkg.description }}
                        />
                        {pkg.description.length > 100 && (
                          <button
                            className="text-blue-600 mt-1"
                            onClick={() =>
                              setExpandedDesc((prev) => ({
                                ...prev,
                                [pkg._id]: !prev[pkg._id],
                              }))
                            }
                          >
                            {expandedDesc[pkg._id] ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredPackages.length === 0 && (
              <div className="min-h-screen">
                <p className="text-gray-500 text-center">
                  No packages found for your selected filters.
                </p>
              </div>
            )}
          </section>

          {showModal && selectedOffer && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Stepper
                initialStep={1}
                onStepChange={handleSteps}
                onNext={handleSteps}
                backButtonText="Previous"
                nextButtonText="Next"
                stepCircleContainerClassName="px-4 py-4"
                onClose={() => setShowModal(false)}
              >
                {/* Step 1: Contact */}
                <Step>
                  <h2 className="text-xl font-bold mb-6 text-gray-900 text-center">
                    Contact Information
                  </h2>
                  <div className="space-y-5">
                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => {
                          setContact({ ...contact, phone: e.target.value });
                          if (errors.phone)
                            setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="Enter phone number"
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          setContact({ ...contact, email: e.target.value });
                          if (errors.email)
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="Enter email address"
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </Step>

                {/* Step 2: Guests */}
                <Step>
                  <div className="flex justify-between mb-2 items-center">
                    <h2 className="text-lg font-semibold ">Guest Details</h2>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add More Guest
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[290px] overflow-auto p-2">
                    {guests.map((guest, index) => (
                      <GuestCard
                        key={index}
                        index={index}
                        guest={guest}
                        updateGuest={updateGuest}
                        removeGuest={removeGuest}
                        errors={errors}
                        setErrors={setErrors}
                      />
                    ))}
                  </div>
                </Step>

                {/* Step 3: Summary + Payment */}
                <Step>
                  <h2 className="text-lg font-semibold mb-4">
                    Booking Summary
                  </h2>
                  <div className="space-y-2 text-gray-700 mb-4">
                    <p>
                      <strong>Package:</strong> {selectedOffer.title} -{" "}
                      {selectedOffer.currency} {selectedOffer.amount} /{" "}
                      {selectedOffer.fareType}
                    </p>
                    <p>
                      <strong>Contact:</strong> {contact.phone} /{" "}
                      {contact.email}
                    </p>
                    <div>
                      <strong>Guests ({guests.length}):</strong>
                      <ul className="list-disc ml-5">
                        {guests.map((g, i) => (
                          <li key={i}>
                            {g.title} {g.firstName} {g.lastName}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stripe Payment */}
                    <Elements stripe={stripePromise}>
                      <BookingStep
                        selectedOffer={selectedOffer}
                        contact={contact}
                        guests={guests}
                        onClose={() => setShowModal(false)}
                      />
                    </Elements>
                  </div>
                </Step>
              </Stepper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
