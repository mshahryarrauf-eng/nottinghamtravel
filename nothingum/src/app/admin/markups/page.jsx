"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import LazyGlobeLoader from "@/components/common/lazyLoading";
export default function MarkupsPage() {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMarkup, setEditMarkup] = useState(null);
  const [formData, setFormData] = useState({
    type: "Fixed",
    amount: "",
    category: "",
  });

  // ✅ Fetch All Markups
  const fetchMarkups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/markup", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMarkups(data.data);
      else console.error(data.message);
    } catch (err) {
      console.error("Fetch Markups Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkups();
  }, []);

  // ✅ Open Add Modal
  const openAddModal = () => {
    setEditMarkup(null);
    setFormData({ type: "Fixed", amount: "", category: "" });
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const openEditModal = (markup) => {
    setEditMarkup(markup);
    setFormData({
      type: markup.type,
      amount: markup.amount,
      category: markup.category,
    });
    setIsModalOpen(true);
  };

  // ✅ Delete Markup
  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/markup", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        setMarkups(markups.filter((m) => m._id !== id));
        Swal.fire("Deleted!", "Markup has been deleted.", "success");
      } else {
        Swal.fire("Error", data.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ✅ Add / Update Markup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const url = "/api/admin/markup";
    const method = editMarkup ? "PUT" : "POST";
    const body = editMarkup
      ? { id: editMarkup._id, ...formData }
      : { ...formData };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire(
          "Success!",
          editMarkup ? "Markup updated successfully!" : "Markup added!",
          "success"
        );
        setIsModalOpen(false);
        fetchMarkups();
      } else {
        Swal.fire("Error", data.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Markups</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Add Markup
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {markups.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No markups found.
                  </td>
                </tr>
              ) : (
                markups.map((markup) => (
                  <tr key={markup._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{markup.category}</td>
                    <td className="p-3">{markup.type}</td>
                    <td className="p-3">{markup.amount}</td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(markup)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(markup._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">
              {editMarkup ? "Edit Markup" : "Add Markup"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Applies To */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Applies To
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Service</option>
                  <option value="Flights">Flights</option>
                  <option value="Hotels">Hotels</option>
                </select>
              </div>

              {/* Markup Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 outline-none transition-all"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
                >
                  {editMarkup ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
