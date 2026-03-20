"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import { showAlert } from "@/components/common/mixin";
import { Loader2 } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const HotelSearchForm = () => {
  const router = useRouter();
  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const [hotel, setHotel] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);

  const [guestNationality, setGuestNationality] = useState(null);
  const [openRoomIndex, setOpenRoomIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hotelError, setHotelError] = useState("");
  const [GuestNationalityError, setGuestNationalityError] = useState("");
  // PaxRooms state
  const [paxRooms, setPaxRooms] = useState([
    { Adults: 1, Children: 0, ChildrenAges: [] },
  ]);
  const [showPaxModal, setShowPaxModal] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleHotelChange = (selected) => {
    setHotel(selected);
    if (selected && selected.length > 0) {
      setHotelError(""); // 🟢 remove error when user selects hotel
    }
  };

  const handleBlur = () => {
    if (!hotel || hotel.length === 0) {
      setHotelError("Please select at least one hotel."); // 🔴 show error if empty
    }
    if (!guestNationality) {
      setGuestNationalityError("guest nationality is required");
    }
  };
  // ✅ Fetch country list for both destination and nationality
  useEffect(() => {
    const fetchCountries = async () => {
      setCountryLoading(true);
      try {
        const response = await fetch("/api/tbo/countryList");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        const options = (data.CountryList || []).map((c) => ({
          value: c.Code,
          label: c.Name,
        }));
        setCountries(options);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setCountryLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities by selected country
  useEffect(() => {
    if (!country) {
      setCities([]);
      setCity(null);
      setHotels([]);
      setHotel([]);
      return;
    }

    const fetchCities = async () => {
      setCityLoading(true);
      try {
        const response = await fetch("/api/tbo/citiesByCountry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CountryCode: country.value }),
        });
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        const options = (data.CityList || []).map((c) => ({
          value: c.Code,
          label: c.Name,
        }));
        setCities(options);
        setCity(null);
        setHotels([]);
        setHotel([]);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setCityLoading(false);
      }
    };

    fetchCities();
  }, [country]);

  // Fetch hotels when city changes
  useEffect(() => {
    if (!city) {
      setHotels([]);
      setHotel([]);
      return;
    }

    const fetchHotels = async () => {
      setHotelLoading(true);
      try {
        const response = await fetch("/api/tbo/hotelsListByCity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            CityCode: city.value,
            IsDetailedResponse: false,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch hotels");

        const data = await response.json();
        const options = (data.Hotels || []).map((h) => ({
          value: h.HotelCode,
          label: h.HotelName,
        }));
        setHotels(options);
        setHotel([]);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setHotelLoading(false);
      }
    };

    fetchHotels();
  }, [city]);

  // Adult control
  const handleAdultChange = (roomIndex, change) => {
    setPaxRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === roomIndex
          ? { ...room, Adults: Math.min(8, Math.max(1, room.Adults + change)) }
          : room
      )
    );
  };

  // Children control
  const handleChildrenChange = (roomIndex, change) => {
    setPaxRooms((prevRooms) =>
      prevRooms.map((room, i) => {
        if (i !== roomIndex) return room;

        const newChildren = Math.min(6, Math.max(0, room.Children + change));
        let newAges = [...room.ChildrenAges];

        if (newChildren > room.Children) newAges.push(0);
        else if (newChildren < room.Children) newAges.pop();

        return { ...room, Children: newChildren, ChildrenAges: newAges };
      })
    );
  };

  const handleChildAgeChange = (roomIndex, childIndex, age) => {
    setPaxRooms((prevRooms) =>
      prevRooms.map((room, i) => {
        if (i !== roomIndex) return room;
        const updatedAges = [...room.ChildrenAges];
        updatedAges[childIndex] = Number(age);
        return { ...room, ChildrenAges: updatedAges };
      })
    );
  };

  const handleAddRoom = () => {
    setPaxRooms((prev) => [
      ...prev,
      { Adults: 1, Children: 0, ChildrenAges: [] },
    ]);
  };

  const handleRemoveRoom = (index) => {
    setPaxRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hotel.length) {
      return setHotelError("Please select at least one hotel.");
    }

    if (!guestNationality?.value) {
      return setGuestNationalityError("Please select guest nationality.");
    }

    const payload = {
      CheckIn: format(dateRange[0].startDate, "yyyy-MM-dd"),
      CheckOut: format(dateRange[0].endDate, "yyyy-MM-dd"),
      HotelCodes: hotel.map((h) => h.value).join(","),
      GuestNationality: guestNationality?.value,
      PaxRooms: paxRooms,
      ResponseTime: 10.0,
      IsDetailedResponse: false,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/tbo/searchQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("warning", data.message || "Failed to fetch hotels");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("hotelsData", JSON.stringify(data));
      setLoading(false);
      router.push("/hotels-details", { state: { data } });
    } catch (err) {
      console.error("❌ Submit Error:", err);
      showAlert("error", err.data.message || "Failed to fetch hotels");
    }
  };

  // Summary for rooms
  const totalAdults = paxRooms.reduce((sum, r) => sum + r.Adults, 0);
  const totalChildren = paxRooms.reduce((sum, r) => sum + r.Children, 0);
  const summary = `${paxRooms.length} room${
    paxRooms.length > 1 ? "s" : ""
  }, ${totalAdults} adult${totalAdults > 1 ? "s" : ""}${
    totalChildren
      ? `, ${totalChildren} child${totalChildren > 1 ? "ren" : ""}`
      : ""
  }`;

  return (
    <div className="p-6 rounded-lg shadow-xl bg-white max-w-6xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Destination Country */}
          <div>
            <label className="text-sm font-semibold mb-1">
              Destination Country
            </label>
            <Select
              options={countries}
              value={country}
              onChange={setCountry}
              isSearchable
              isLoading={countryLoading}
              placeholder="Select Country"
            />
          </div>

          {/* Destination City */}
          <div>
            <label className="text-sm font-semibold mb-1">
              Destination City
            </label>
            <Select
              options={cities}
              value={city}
              onChange={setCity}
              isSearchable
              isLoading={cityLoading}
              placeholder="Select City"
              isDisabled={!country}
            />
          </div>

          {/* Hotels */}
          <div>
            <label className="text-sm font-semibold mb-1">Select Hotels</label>
            <Select
              options={hotels}
              value={hotel}
              onChange={handleHotelChange}
              onBlur={handleBlur}
              isMulti
              isSearchable
              isLoading={hotelLoading}
              placeholder="Select Hotels"
              isDisabled={!city}
              className="w-full min-w-[250px]"
              styles={{
                valueContainer: (base) => ({
                  ...base,
                  maxHeight: "37px",
                  overflowY: "auto",
                }),
              }}
            />
            {hotelError && (
              <p className="text-red-500 text-xs mt-1">{hotelError}</p>
            )}
          </div>

          {/* Guest Nationality */}
          <div>
            <label className="text-sm font-semibold mb-1">
              Guest Nationality
            </label>
            <Select
              options={countries}
              value={guestNationality}
              onChange={(selected) => {
                setGuestNationality(selected);
                if (selected) setGuestNationalityError("");
              }}
              onBlur={handleBlur}
              isSearchable
              isLoading={countryLoading}
              placeholder="Select Nationality"
            />
            {GuestNationalityError && (
              <p className="text-red-500 text-xs mt-1">
                {GuestNationalityError}
              </p>
            )}
          </div>
          {/* Date Range Picker */}
          <div>
            <label className="text-sm font-semibold mb-1">
              Check-in & Check-out
            </label>
            <div
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="border border-gray-300 rounded-sm px-4 py-2 cursor-pointer select-none w-full"
            >
              <span className="text-gray-500">
                {format(dateRange[0].startDate, "eee, MMM dd")} -{" "}
                {format(dateRange[0].endDate, "eee, MMM dd")}
              </span>
            </div>

            {showDatePicker && (
              <div className="absolute z-50 mt-2">
                <DateRange
                  editableDateInputs
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* Rooms & Guests */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1">Rooms </label>
            <div
              onClick={() => setShowPaxModal(!showPaxModal)}
              className="border border-gray-300 rounded-sm px-4 py-2 cursor-pointer select-none"
            >
              {summary}
            </div>

            {showPaxModal && (
              <div className="absolute z-50 bg-white shadow-xl p-4 rounded-lg mt-2 w-full md:w-96 max-h-[80vh] overflow-y-auto">
                {paxRooms.map((room, index) => {
                  const isOpen = openRoomIndex === index;
                  return (
                    <div key={index} className="border-b pb-3 mb-3">
                      <div
                        className="flex justify-between items-center cursor-pointer mb-2"
                        onClick={() => setOpenRoomIndex(isOpen ? null : index)}
                      >
                        <h4 className="font-semibold text-sm">
                          Room {index + 1}
                        </h4>
                        <div className="flex items-center gap-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveRoom(index);
                                setOpenRoomIndex(0);
                              }}
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          )}
                          <span className="text-gray-500 text-xs">
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {isOpen && (
                        <div>
                          {/* Adults */}
                          <div className="flex justify-between items-center mb-2">
                            <span>Adults (18+ yrs)</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={room.Adults <= 1}
                                onClick={() => handleAdultChange(index, -1)}
                                className={`px-2 border rounded ${
                                  room.Adults <= 1
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                -
                              </button>
                              <span>{room.Adults}</span>
                              <button
                                type="button"
                                disabled={room.Adults >= 8}
                                onClick={() => handleAdultChange(index, 1)}
                                className={`px-2 border rounded ${
                                  room.Adults >= 8
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex justify-between items-center mb-2">
                            <span>Children (0-17 yrs)</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={room.Children <= 0}
                                onClick={() => handleChildrenChange(index, -1)}
                                className={`px-2 border rounded ${
                                  room.Children <= 0
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                -
                              </button>
                              <span>{room.Children}</span>
                              <button
                                type="button"
                                disabled={room.Children >= 6}
                                onClick={() => handleChildrenChange(index, 1)}
                                className={`px-2 border rounded ${
                                  room.Children >= 6
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Child Ages */}
                          {room.Children > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Please select each child’s age:
                              </p>
                              {room.ChildrenAges.map((age, childIdx) => (
                                <div
                                  key={childIdx}
                                  className="mb-1 flex justify-between items-center"
                                >
                                  <label className="text-xs">
                                    Child {childIdx + 1} age:
                                  </label>
                                  <select
                                    value={age}
                                    onChange={(e) =>
                                      handleChildAgeChange(
                                        index,
                                        childIdx,
                                        e.target.value
                                      )
                                    }
                                    className="border rounded px-2 py-1 text-sm"
                                  >
                                    {[...Array(18).keys()].map((a) => (
                                      <option key={a} value={a}>
                                        {a === 0
                                          ? "<1 year"
                                          : `${a} year${a > 1 ? "s" : ""}`}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Room */}
                <button
                  type="button"
                  onClick={() => {
                    handleAddRoom();
                    setOpenRoomIndex(paxRooms.length);
                  }}
                  className="bg-gray-100 w-full py-2 rounded text-sm font-semibold"
                >
                  + Add Room
                </button>

                {/* Done */}
                <button
                  type="button"
                  onClick={() => setShowPaxModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-3 py-2 rounded font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-[#23AFEC] hover:bg-[#0fa8ea] text-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto mt-4 ${
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

export default HotelSearchForm;
