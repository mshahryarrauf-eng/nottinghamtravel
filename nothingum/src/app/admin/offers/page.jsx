"use client";
import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";
import { showAlert } from "@/components/common/mixin";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

import Swal from "sweetalert2";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import DataTable from "react-data-table-component";

const CATEGORIES = [
  "Family",
  "Adventure",
  "Beach Break",
  "Honeymoon",
  "Religious",
  "City Break",
  "Tours",
  "Sports",
  "Adults Only",
  "All Inclusive",
  "No Fly",
  "Cruise & Rail",
  "Cruise & Tour",
];

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"];
const FARE_TYPES = ["Per Person", "Total"];
const JOURNEY_TYPES = ["One Way", "Two Way"];

export default function OfferManager() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [formData, setFormData] = useState({
    type: "",
    fareType: "Per Person",
    category: [],
    title: "",
    destination: "",
    hotelName: "",
    rating: "",
    dateFrom: "",
    dateTo: "",
    cabinClass: "",
    slug: "",
    description: "",
    images: [],
    amount: "",
    currency: "USD",
    active: true,
    showOnHome: false,
    airline: "",
    journeyType: "",
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (data.success) console.log(data.offers);
      setOffers(
        data.offers.map((offer) => ({
          ...offer,
          category: Array.isArray(offer.category)
            ? offer.category
            : offer.category
            ? [offer.category]
            : [],
        }))
      );
    } catch (err) {
      console.error("Fetch Offers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch("/api/offers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ _id: id }),
      });

      const data = await res.json();
      if (data.success) {
        setOffers((prev) => prev.filter((o) => o._id !== id));
        showAlert("success", "Offer deleted successfully");
      } else showAlert("error", data.error || "Something went wrong");
    } catch {
      showAlert("error", "Delete failed");
    }
  };

  const handleToggleActive = async (id, currentState) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ _id: id, active: !currentState }),
      });

      const data = await res.json();
      if (data.success) {
        setOffers((prev) =>
          prev.map((o) => (o._id === id ? { ...o, active: !currentState } : o))
        );
        showAlert(
          "success",
          `Offer is now ${!currentState ? "Active" : "Inactive"}`
        );
      } else showAlert("error", data.error || "Something went wrong");
    } catch {
      showAlert("error", "Toggle failed");
    }
  };

  const openModal = (offer = null) => {
    setEditingOffer(offer);

    if (offer) {
      let categories = offer.category || [];
      // Agar first element JSON string hai, parse karo
      if (categories.length === 1 && categories[0].startsWith("[")) {
        try {
          categories = JSON.parse(categories[0]);
        } catch (err) {
          categories = [];
        }
      }

      setFormData({
        ...offer,
        category: Array.isArray(categories) ? categories : [],
      });
    } else {
      setFormData({
        type: "",
        fareType: "Per Person",
        category: [],
        title: "",
        destination: "",
        hotelName: "",
        rating: "",
        dateFrom: "",
        dateTo: "",
        cabinClass: "",
        description: "",
        images: [],
        amount: "",
        slug: "",
        currency: "USD",
        active: true,
        showOnHome: false,
        airline: "",
        journeyType: "",
      });
    }

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    const ALLOWED_FIELDS = {
      Flight: [
        "type",
        "_id",
        "fareType",
        "title",
        "destination",
        "amount",
        "currency",
        "dateFrom",
        "dateTo",
        "slug",
        "category",
        "airline",
        "journeyType",
        "active",
        "showOnHome",
        "description",
      ],
      Hotel: [
        "type",
        "_id",
        "fareType",
        "title",
        "destination",
        "hotelName",
        "rating",
        "amount",
        "currency",
        "dateFrom",
        "dateTo",
        "slug",
        "category",
        "active",
        "showOnHome",
        "description",
      ],
      Package: [
        "_id",
        "type",
        "fareType",
        "title",
        "destination",
        "hotelName",
        "rating",
        "amount",
        "currency",
        "dateFrom",
        "dateTo",
        "slug",
        "category",
        "cabinClass",
        "active",
        "showOnHome",
        "description",
      ],
    };

    e.preventDefault();
    const adminToken = localStorage.getItem("adminToken");
    const method = editingOffer ? "PUT" : "POST";
    const url = "/api/offers";

    const form = new FormData();

    const allowed = ALLOWED_FIELDS[formData.type] || [];

    Object.entries(formData).forEach(([key, value]) => {
      if (!allowed.includes(key)) return; // ❗ type ke ilawa kuch na jaye
      if (key === "images") return;
      if (value == null || value === "") return;

      if (key === "category") {
        form.append("category", JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    });

    formData.images.forEach((img) => {
      if (img instanceof File) {
        form.append("images", img);
      } else {
        form.append("existingImages", img);
      }
    });

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        showAlert("success", editingOffer ? "Offer updated!" : "Offer added!");
        setShowModal(false);
        fetchOffers();
      } else {
        showAlert("error", data.error || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Save failed");
    }
  };

  const columns = [
    { name: "Title", selector: (row) => row.title, sortable: true, grow: 2 },
    { name: "Type", selector: (row) => row.type },
    { name: "Destination", selector: (row) => row.destination || "-" },
    { name: "Amount", selector: (row) => `${row.currency} ${row.amount}` },
    { name: "Slug", selector: (row) => `${row.slug}` },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.active
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => handleToggleActive(row._id, row.active)}
            className={`${
              row.active ? "text-green-600" : "text-gray-400"
            } text-xl hover:scale-110`}
          >
            {row.active ? <FaToggleOn /> : <FaToggleOff />}
          </button>
          <button
            onClick={() => openModal(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Offers</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Offer
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={offers}
          pagination
          highlightOnHover
          striped
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">
              {editingOffer ? "Update Offer" : "Add Offer"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  Offer Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Package">Package</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Flight">Flight</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  Fare Type
                </label>
                <select
                  name="fareType"
                  value={formData.fareType}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {FARE_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Offer title"
                  required
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  Destination
                </label>
                <input
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Destination"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">Amount</label>
                <input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  required
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  Currency
                </label>
                <input
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="Currency (USD, GBP...)"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {formData.type !== "Flight" && (
                <>
                  <div className="flex flex-col">
                    <label className="font-medium mb-1 text-gray-700">
                      Hotel Name
                    </label>
                    <input
                      name="hotelName"
                      value={formData.hotelName}
                      onChange={handleChange}
                      placeholder="Hotel Name"
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1 text-gray-700">
                      Rating
                    </label>
                    <input
                      name="rating"
                      type="number"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="Rating (1–5)"
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {formData.type === "Package" && (
                <div className="flex flex-col">
                  <label className="font-medium mb-1 text-gray-700">
                    Cabin Class
                  </label>
                  <select
                    name="cabinClass"
                    value={formData.cabinClass}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Cabin Class</option>
                    {CABIN_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === "Flight" && (
                <>
                  <div className="flex flex-col">
                    <label className="font-medium mb-1 text-gray-700">
                      Airline
                    </label>
                    <input
                      name="airline"
                      value={formData.airline}
                      onChange={handleChange}
                      placeholder="Airline"
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1 text-gray-700">
                      Journey Type
                    </label>
                    <select
                      name="journeyType"
                      value={formData.journeyType}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Journey Type</option>
                      {JOURNEY_TYPES.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  From Date
                </label>
                <input
                  name="dateFrom"
                  type="date"
                  value={formData.dateFrom?.substring(0, 10) || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">
                  To Date
                </label>
                <input
                  name="dateTo"
                  type="date"
                  value={formData.dateTo?.substring(0, 10) || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1 text-gray-700">Slug</label>
                <input
                  name="slug"
                  type="text"
                  value={formData.slug || ""}
                  onChange={handleChange}
                  placeholder="Enter Slug"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="font-medium mb-1 text-gray-700">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const categories = Array.isArray(formData.category)
                      ? formData.category
                      : [];
                    return (
                      <label key={c} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          value={c}
                          checked={categories.includes(c)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              category: checked
                                ? [...categories, c]
                                : categories.filter((cat) => cat !== c),
                            }));
                          }}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-gray-700">{c}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="font-medium mb-1 text-gray-700">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData((prev) => ({
                      ...prev,
                      images: [
                        ...prev.images.filter((img) => typeof img === "string"),
                        ...files,
                      ],
                    }));
                  }}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="flex gap-2 mt-2 flex-wrap">
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        }
                        alt={`preview-${idx}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex my-3 flex-col col-span-2 md:col-span-2">
                <label className="font-medium mb-1 text-gray-700">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleQuillChange}
                  placeholder="Enter description..."
                  className=" border-gray-300 rounded-lg pb-6 pt-2 h-full resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex mt-1 gap-4 col-span-1 md:col-span-2">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    name="showOnHome"
                    checked={formData.showOnHome}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Show on Home
                </label>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingOffer ? "Update Offer" : "Add Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
