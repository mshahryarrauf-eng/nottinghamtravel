"use client";

import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import DataTable from "react-data-table-component";

export default function TailorMadeQueryManager() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch All Tailor Made Queries
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tailor-made-query");
      const data = await res.json();
      if (data.success) setQueries(data.data);
      else console.error(data.error || "Failed to fetch queries");
    } catch (err) {
      console.error("Fetch Queries Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // ✅ Delete Query
  const handleDelete = async (id) => {
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
      const res = await fetch("/api/tailor-made-query", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        setQueries((prev) => prev.filter((q) => q._id !== id));
        Swal.fire("Deleted!", "Query has been deleted.", "success");
      } else {
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ DataTable Columns
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      grow: 2,
    },

    {
      name: "Looking For",
      selector: (row) => row.lookingFor.join(", "),
    },
    {
      name: "Departure",
      selector: (row) =>
        new Date(row.departureDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      name: "Return",
      selector: (row) =>
        row.returnDate
          ? new Date(row.returnDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },

    {
      name: "From → To",
      selector: (row) => `${row.leavingFrom} → ${row.destination}`,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      grow: 2,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: "true",
    },
  ];

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={queries}
          pagination
          highlightOnHover
          responsive
          striped
          noHeader
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#f3f4f6",
                color: "#111827",
              },
            },
            cells: {
              style: {
                fontSize: "14px",
                color: "#374151",
              },
            },
            rows: {
              style: {
                minHeight: "50px",
              },
              highlightOnHoverStyle: {
                backgroundColor: "#e0f2fe",
                borderBottomColor: "#d1d5db",
                borderRadius: "4px",
                outline: "1px solid #d1d5db",
              },
            },
            pagination: {
              style: {
                borderTop: "1px solid #e5e7eb",
              },
            },
          }}
        />
      )}
    </div>
  );
}
