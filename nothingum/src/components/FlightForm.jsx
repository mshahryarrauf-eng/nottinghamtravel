"use client";
import { useState } from "react";

export default function FlightForm({ onResults }) {
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = {
      from: e.target.from.value,
      to: e.target.to.value,
      departDate: e.target.depart.value,
      returnDate: e.target.returnDate.value,
      tripType: e.target.tripType.value,
      passengers: 1,
    };

    const res = await fetch("/api/flights/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    setLoading(false);

    onResults(data);
  };

  return (
    <form onSubmit={handleSearch}>
      <input name="from" placeholder="From (LHE)" required />
      <input name="to" placeholder="To (DXB)" required />

      <input type="date" name="depart" required />
      <input type="date" name="returnDate" />

      <select name="tripType">
        <option value="oneway">One Way</option>
        <option value="round">Round Trip</option>
      </select>

      <button>{loading ? "Searching..." : "Search Flights"}</button>
    </form>
  );
}
