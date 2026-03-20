"use client";
import { useState } from "react";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("round");
  const [origin, setOrigin] = useState("MIA");
  const [destination, setDestination] = useState("MCO");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassengerBox, setShowPassengerBox] = useState(false);

  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [cabinClass, setCabinClass] = useState("ECONOMY");

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const updatePassenger = (type, delta) => {
    setPassengers((prev) => {
      const next = prev[type] + delta;

      if (type === "adults" && next < 1) return prev;
      if (next < 0) return prev;

      if (type === "infants" && next > prev.adults) return prev;

      const total = prev.adults + prev.children + prev.infants + delta;

      if (total > 9) return prev;

      return { ...prev, [type]: next };
    });
  };

  const passengerSummary = () => {
    const parts = [];

    if (passengers.adults > 0) {
      parts.push(
        `${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}`
      );
    }

    if (passengers.children > 0) {
      parts.push(
        `${passengers.children} Child${passengers.children > 1 ? "ren" : ""}`
      );
    }

    if (passengers.infants > 0) {
      parts.push(
        `${passengers.infants} Infant${passengers.infants > 1 ? "s" : ""}`
      );
    }

    return parts.join(", ");
  };

  const handleSearch = async () => {
    if (!departureDate || (tripType === "round" && !returnDate)) {
      alert("Please select required dates");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/searchFlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          origin,
          destination,
          departureDate,
          returnDate: tripType === "round" ? returnDate : null,
          passengers: {
            ADT: passengers.adults,
            CHD: passengers.children,
            INF: passengers.infants,
          },
          cabinClass,
        }),
      });
    } catch (err) {
      alert("Flight search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl max-w-6xl mx-auto mt-10">
      {/* Trip Type */}
      <div className="flex gap-4 justify-center mb-6">
        {["oneway", "round"].map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded font-semibold ${
              tripType === type ? "bg-[#23AFEC] text-white" : "bg-gray-200"
            }`}
          >
            {type === "oneway" ? "One-Way" : "Round-Trip"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Origin */}
        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          placeholder="Origin"
          className="border px-4 py-2 rounded"
        />

        {/* Destination */}
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="Destination"
          className="border px-4 py-2 rounded"
        />

        {/* Departure */}
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        {/* Return */}
        {tripType === "round" && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        )}

        {/* Passenger Selector */}
        <div className="relative sm:col-span-2">
          <button
            onClick={() => setShowPassengerBox(!showPassengerBox)}
            className="w-full border px-4 py-3 rounded flex justify-between"
          >
            <span>
              {passengerSummary()} ·{" "}
              {cabinClass.charAt(0) + cabinClass.slice(1).toLowerCase()}
            </span>

            <span>▼</span>
          </button>

          {showPassengerBox && (
            <div className="absolute z-20 bg-white w-full border rounded-lg shadow-xl mt-2 p-4">
              <p className="text-sm text-gray-500 mb-3">
                Please select the exact number of passengers
              </p>

              {[
                { label: "Adults", sub: "12+ years old", key: "adults" },
                { label: "Children", sub: "2–11 years old", key: "children" },
                { label: "Infants on lap", sub: "Under 2 years old", key: "infants" },
              ].map((p) => (
                <div
                  key={p.key}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="font-semibold">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.sub}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updatePassenger(p.key, -1)}
                      className="w-8 h-8 border rounded-full"
                    >
                      −
                    </button>
                    <span>{passengers[p.key]}</span>
                    <button
                      onClick={() => updatePassenger(p.key, 1)}
                      className="w-8 h-8 border rounded-full text-blue-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {/* Cabin */}
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full border rounded px-4 py-2 mt-3"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>

              <button
                onClick={() => setShowPassengerBox(false)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="mt-6 w-full bg-[#23AFEC] text-white py-3 rounded-lg font-semibold"
      >
        {loading ? "Searching..." : "Search Flights"}
      </button>
    </div>
  );
};

export default FlightSearch;
