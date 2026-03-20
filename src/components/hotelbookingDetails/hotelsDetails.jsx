'use client';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import {
  FaFilter,
  FaTimes,
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaSmokingBan,
  FaDoorClosed,
  FaCheckCircle,
  FaUtensils,
  FaHotel,
  FaClock,
  FaListUl,
  FaInfoCircle,
} from 'react-icons/fa';
import { showAlert } from '@/components/common/mixin';
import LazyGlobeLoader from '@/components/common/lazyLoading';

export default function HotelsDetails() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [loadingRoomIndex, setLoadingRoomIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentImages, setCurrentImages] = useState({});
  const [filters, setFilters] = useState({
    refundable: false,
    mealType: 'All',
    starRating: 0,
    priceRange: [0, 2000],
  });

  const filteredHotels = hotels.filter(hotel => {
    const hasRefundable = !filters.refundable || hotel.Rooms?.some(r => r.IsRefundable);
    const matchesMeal =
      filters.mealType === 'All' || hotel.Rooms?.some(r => r.MealType === filters.mealType);
    const matchesStar = filters.starRating === 0 || (hotel.HotelRating || 0) >= filters.starRating;
    const matchesPrice = hotel.Rooms?.some(
      r => r.FinalPrice >= filters.priceRange[0] && r.FinalPrice <= filters.priceRange[1]
    );

    return hasRefundable && matchesMeal && matchesStar && matchesPrice;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages(prev => {
        const updated = { ...prev };
        hotels.forEach((hotel, index) => {
          if (hotel.Images?.length > 1) {
            const nextIndex = ((prev[index] || 0) + 1) % hotel.Images.length;
            updated[index] = nextIndex;
          }
        });
        return updated;
      });
    }, 3000); // change image every 3s

    return () => clearInterval(interval);
  }, [hotels]);

  useEffect(() => {
    const saved = sessionStorage.getItem('hotelsData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHotels(parsed?.data || parsed || []);
    }
  }, []);

  const BookNow = async (room, index) => {
    try {
      setLoadingRoomIndex(index);
      const res = await fetch('/api/tbo/PreBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookingCode: room.BookingCode,
          PaymentMode: 'Limit',
        }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        showAlert(
          'warning',
          data?.Status?.Description || 'Something went wrong while pre-booking.'
        );
        return;
      }
      setLoadingRoomIndex(null);
      sessionStorage.setItem('bookingDetails', JSON.stringify(data));
      router.push('/booking-details');
    } catch (error) {
      console.warn('error', error);
    } finally {
      setLoadingRoomIndex(null);
    }
  };

  if (!hotels.length)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
      </div>
    );

  return (
    <div className="my-4">
      <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
        {isFilterOpen && (
          <div
            className="absolute z-10 h-full w-full bg-black/60 xl:hidden"
            onClick={() => setIsFilterOpen(false)}
          ></div>
        )}

        <div
          className={`
          panel
          absolute
          top-0
          left-0
          z-20
          h-full
          w-[260px]
          p-5
          bg-white dark:bg-gray-900
          shadow-md
          transition-all
          duration-300
          overflow-y-auto
          rounded-r-md
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          xl:relative xl:translate-x-0 xl:w-[20%]
        `}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              type="button"
              className="xl:hidden text-gray-500 hover:text-primary"
              onClick={() => setIsFilterOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <aside className="space-y-3">
            {/* Refundable */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="refundable"
                checked={filters.refundable}
                onChange={e => setFilters({ ...filters, refundable: e.target.checked })}
              />
              <label htmlFor="refundable" className="text-gray-700">
                Refundable only
              </label>
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Meal Type</label>
              <select
                value={filters.mealType}
                onChange={e => setFilters({ ...filters, mealType: e.target.value })}
                className="w-full border rounded-lg p-2"
              >
                <option>All</option>
                <option value="All_Inclusive_All_Meal">All Inclusive All Meal</option>
                <option value="Full_Board">Full Board</option>
                <option value="Half_Board">Half Board</option>
                <option value="Room_Only">Room Only</option>
                <option value="BreakFast">BreakFast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="BreakFast_Lunch">BreakFast Lunch</option>
                <option value="Breakfast_For_1">Breakfast For 1</option>
                <option value="Breakfast_For_2">Breakfast For 2</option>
              </select>
            </div>

            {/* ⭐ Star Rating */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Minimum Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={22}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        starRating: filters.starRating === s ? 0 : s,
                      })
                    }
                    className={`cursor-pointer transition ${
                      s <= filters.starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 💰 Price Range */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={filters.priceRange[1]}
                onChange={e =>
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)],
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
            className="flex items-center gap-2 mb-4 text-primary xl:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="text-lg" />
            <span className="font-medium">Filters</span>
          </button>

          <section className="space-y-6">
            {filteredHotels.map((hotel, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5  ">
                <div className="flex flex-col md:flex-row gap-8  pb-2 overflow-hidden">
                  <div className="relative w-full md:w-2/5 h-60 overflow-hidden rounded-2xl">
                    {hotel.Images && hotel.Images.length > 0 ? (
                      <>
                        {/* Image Slides */}
                        {hotel.Images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={hotel.HotelName}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                              idx === (currentImages[i] || 0) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        ))}

                        <button
                          onClick={() =>
                            setCurrentImages(prev => ({
                              ...prev,
                              [i]: ((prev[i] || 0) - 1 + hotel.Images.length) % hotel.Images.length,
                            }))
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 font-bold p-2 rounded-full shadow-md transition"
                        >
                          ◀
                        </button>

                        <button
                          onClick={() =>
                            setCurrentImages(prev => ({
                              ...prev,
                              [i]: ((prev[i] || 0) + 1) % hotel.Images.length,
                            }))
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 font-bold p-2 rounded-full shadow-md transition"
                        >
                          ▶
                        </button>

                        <div className="absolute bottom-4 w-full flex justify-center gap-2">
                          {hotel.Images.map((_, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                setCurrentImages(prev => ({
                                  ...prev,
                                  [i]: idx,
                                }))
                              }
                              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                idx === (currentImages[i] || 0)
                                  ? 'bg-blue-600 scale-110'
                                  : 'bg-white/60 hover:bg-blue-300'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Hotel Rating Badge */}
                        {hotel.HotelRating && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                            <FaStar /> {hotel.HotelRating} Star
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No Images Available
                      </div>
                    )}
                  </div>

                  <div className="flex-1  flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {hotel.HotelName}
                    </h2>

                    {hotel.Address && (
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{hotel.Address}</span>
                      </p>
                    )}

                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1 mb-1">
                      {hotel.CityName && <p>🏙️ City: {hotel.CityName}</p>}
                      {hotel.CountryName && <p>🌍 Country: {hotel.CountryName}</p>}
                      {hotel.PinCode && <p>📮 Pin Code: {hotel.PinCode}</p>}
                    </div>

                    <span
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsOpen(true);
                      }}
                      className="text-blue-600 mb-2 dark:text-blue-400 text-sm font-medium cursor-pointer hover:underline hover:text-blue-700 transition-all duration-200 w-fit"
                    >
                      Show more details →
                    </span>

                    {hotel.Rooms?.length > 0 ? (
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-base ">
                        🛏️ {hotel.Rooms.length} room
                        {hotel.Rooms.length > 1 ? 's' : ''} available as per your search
                      </p>
                    ) : (
                      <p className="text-red-500 font-medium text-base mt-2">
                        ⚠️ No rooms available for your selected criteria
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setSelectedHotel(selectedHotel === hotel ? null : hotel)}
                    className="w-full flex items-center justify-between bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-gray-100 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <span>View Available Rooms</span>
                    <span>{selectedHotel === hotel ? '▲' : '▼'}</span>
                  </button>

                  {selectedHotel === hotel && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 transition-all duration-300">
                      {hotel.Rooms?.map((room, j) => {
                        const roomCount = room?.Name?.length || 1;
                        const roomTitle = room?.Name?.[0] || 'Room';

                        const parseRoomDetails = nameString => {
                          const [title, bed, smoking] = nameString?.split(',') || [];
                          return { title, bed, smoking };
                        };

                        const parsed = parseRoomDetails(roomTitle);

                        return (
                          <div
                            key={j}
                            className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                          >
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-2">
                                {parsed.title?.trim() || 'Room'}{' '}
                                <span className="text-sm text-gray-500">(x{roomCount})</span>
                              </h4>

                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                {parsed.bed && (
                                  <div className="flex items-center gap-1">
                                    <FaBed className="text-blue-500" />
                                    <span>{parsed.bed.trim()}</span>
                                  </div>
                                )}
                                {parsed.smoking?.toLowerCase()?.includes('non') ? (
                                  <div className="flex items-center gap-1">
                                    <FaSmokingBan className="text-red-500" />
                                    <span>{parsed.smoking.trim()}</span>
                                  </div>
                                ) : parsed.smoking ? (
                                  <div className="flex items-center gap-1">
                                    <FaDoorClosed className="text-gray-500" />
                                    <span>{parsed.smoking.trim()}</span>
                                  </div>
                                ) : null}
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" />
                                <span>
                                  Inclusions: {room.Inclusion || 'No inclusions specified'}
                                </span>
                              </p>

                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <FaUtensils className="text-orange-500" />
                                <span>Meal: {room.Meal || 'Not included'}</span>
                              </p>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                    {room.FinalPrice} {hotel.Currency}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    + Tax: {room.TotalTax || 0}
                                  </p>
                                </div>
                                <p
                                  className={`flex items-center gap-1 text-xs mt-2 font-semibold ${
                                    room.IsRefundable ? 'text-green-600' : 'text-red-500'
                                  }`}
                                >
                                  {room.IsRefundable ? (
                                    <>
                                      <CheckCircle size={14} /> Refundable
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={14} /> Non-Refundable
                                    </>
                                  )}
                                </p>
                              </div>

                              <button
                                onClick={() => BookNow(room, j)}
                                disabled={loadingRoomIndex === j}
                                className={`w-full mt-4 py-2 font-semibold rounded-xl shadow-md transition-all duration-300 ${
                                  loadingRoomIndex === j
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                                }`}
                              >
                                {loadingRoomIndex === j ? 'Loading...' : 'Book Now'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {selectedHotel && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" />
            <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full p-2 transition"
                  >
                    <FaTimes size={18} />
                  </button>

                  <div className="flex justify-center flex-wrap gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
                    {[
                      { tab: 'Overview', icon: <FaInfoCircle /> },
                      { tab: 'Facilities', icon: <FaListUl /> },
                      { tab: 'Nearby', icon: <FaMapMarkerAlt /> },
                      { tab: 'Timings', icon: <FaClock /> },
                      { tab: 'Map', icon: <FaMapMarkerAlt /> },
                    ].map(({ tab, icon }) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          activeTab === tab
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {icon}
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === 'Overview' && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                          <FaHotel /> {selectedHotel.HotelName}
                        </h2>
                        {selectedHotel.HotelRating && (
                          <p className="text-yellow-500 text-sm mb-4">
                            {'★'.repeat(selectedHotel.HotelRating)}{' '}
                            <span className="text-gray-500 dark:text-gray-400">
                              ({selectedHotel.HotelRating}-Star)
                            </span>
                          </p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {selectedHotel.Description || 'No description available.'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'Facilities' && selectedHotel.HotelFacilities?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FaListUl /> Hotel Facilities
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                          {selectedHotel.HotelFacilities.slice(0, 24).map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'Nearby' && selectedHotel.Attractions && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FaMapMarkerAlt /> Nearby Attractions
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                          {Object.entries(selectedHotel.Attractions).map(([k, v]) => (
                            <li key={k} className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'Timings' && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <FaClock /> Timings
                        </h3>
                        <p>Check-In: {selectedHotel.CheckInTime}</p>
                        <p>Check-Out: {selectedHotel.CheckOutTime}</p>
                      </div>
                    )}

                    {activeTab === 'Map' &&
                      selectedHotel.Map &&
                      (() => {
                        const [lat, lon] = selectedHotel.Map.split('|');
                        return (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <FaMapMarkerAlt /> Location Map
                            </h3>
                            <div className="overflow-hidden rounded-xl shadow">
                              <iframe
                                src={`https://www.google.com/maps?q=${lat},${lon}&z=14&output=embed`}
                                className="w-full h-[350px] border-0 rounded-xl"
                                loading="lazy"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}
