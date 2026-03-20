"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/common/mixin";
import Select from "react-select";
const OffersSearchForm = () => {
  const router = useRouter();
  const [months, setMonths] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    type: "",
    destination: "",
    month: "",
  });

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/offers/filter");
        const data = await res.json();
        if (data.success) {
          setMonths(
            data.months.map((m) => ({ value: m.number, label: `${m.name}` }))
          );
          setDestinations(
            data.destinations.map((d) => ({ value: d, label: d }))
          );
          setTypes(data.types.map((t) => ({ value: t, label: t })));
        }
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchFilters();
  }, []);

  const validateForm = () => {
    const newErrors = { type: "", destination: "", month: "" };
    let valid = true;

    if (!selectedType) {
      newErrors.type = "Type is required";
      valid = false;
    }
    if (!selectedDestination) {
      newErrors.destination = "Destination is required";
      valid = false;
    }
    if (!selectedMonth) {
      newErrors.month = "Month is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      month: selectedMonth.value,
      destination: selectedDestination.value,
      type: selectedType.value,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/offers/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.offers?.length) {
        setOffers(data.offers);
        sessionStorage.setItem("packages", JSON.stringify(data.offers));
        router.push("/package-details", { state: { data } });
      } else {
        showAlert("warning", "No Package Found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      showAlert("error", err.data.message || "Failed to fetch package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-xl bg-white max-w-6xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type */}
          <div>
            <label className="text-sm font-semibold mb-1">Type</label>
            <Select
              options={types}
              value={selectedType}
              onChange={(val) => {
                setSelectedType(val);
                setErrors((prev) => ({ ...prev, type: "" }));
              }}
              placeholder="Select Type"
              isSearchable
            />
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm font-semibold mb-1">Destination</label>
            <Select
              options={destinations}
              value={selectedDestination}
              onChange={(val) => {
                setSelectedDestination(val);
                setErrors((prev) => ({ ...prev, destination: "" }));
              }}
              placeholder="Select Destination"
              isSearchable
            />
            {errors.destination && (
              <p className="text-red-500 text-xs mt-1">{errors.destination}</p>
            )}
          </div>

          {/* Month */}
          <div>
            <label className="text-sm font-semibold mb-1">Month</label>
            <Select
              options={months}
              value={selectedMonth}
              onChange={(val) => {
                setSelectedMonth(val);
                setErrors((prev) => ({ ...prev, month: "" }));
              }}
              placeholder="Select Month"
              isSearchable
            />
            {errors.month && (
              <p className="text-red-500 text-xs mt-1">{errors.month}</p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2  bg-[#23AFEC] hover:bg-[#0fa8ea] text-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto mt-4 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              Loading...
            </>
          ) : (
            "Search"
          )}
        </button>
      </form>
    </div>
  );
};

export default OffersSearchForm;
