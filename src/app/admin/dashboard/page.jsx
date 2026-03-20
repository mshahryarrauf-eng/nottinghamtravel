"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LazyLoading from "@/components/common/lazyLoading";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [latest, setLatest] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem("admin"));
    if (!adminInfo || adminInfo.role !== "admin") {
      router.push("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setLatest(data.latest);
          setPayments(data.payments);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LazyLoading />
      </div>
    );
  }

  const colors = [
    "bg-[#2A7B9B]",
    "bg-[#2A7B9B]",
    "bg-[#2A7B9B]",
    "bg-[#2A7B9B]",
    "bg-[#2A7B9B]",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ------------------ PAYMENTS CARDS ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {payments?.hotels && (
          <PaymentCard
            title="Hotel Payments"
            currency={payments.hotels._id}
            totalTBOFare={payments.hotels.totalTBOFare}
            totalTBOTax={payments.hotels.totalTBOTax}
            totalMarkup={payments.hotels.totalMarkup}
            totalFinalPrice={payments.hotels.totalFinalPrice}
            color="bg-[#1A90C8]"
          />
        )}
        {payments?.packages && (
          <PaymentCard
            title="Package Payments"
            payments={payments.packages.map((u) => ({
              currency: u.currency,
              totalAmount: u.totalAmount,
            }))}
            color="bg-[#1A90C8]"
          />
        )}
      </div>

      {/* ------------------ STATS CARDS ------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Contacts", value: stats.contacts },
          { title: "Hotel Bookings", value: stats.hotelsBookings },
          { title: "Package Bookings", value: stats.packagesBookings },
          { title: "Total Offers", value: stats.offers },
          { title: "Tailor Made Queries", value: stats.tailorQueries },
        ].map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            color={colors[i % colors.length]}
          />
        ))}
      </div>

      {/* ------------------ LATEST ITEMS ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LatestList
          title="Latest Contacts"
          items={latest.contacts}
          height="260px"
          fields={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "subject", label: "Subject" },
          ]}
        />

        <LatestList
          title="Latest Package Bookings"
          items={latest.packagesBookings}
          height="260px"
          fields={[
            { key: "contact.phone", label: "Phone" },
            { key: "contact.email", label: "Email" },
            { key: "currency", label: "Currency" },
            { key: "totalAmount", label: "Amount" },
            { key: "status", label: "Status" },
          ]}
        />

        <LatestList
          title="Latest Hotel Bookings"
          items={latest.hotelsBookings}
          height="260px"
          fields={[
            { key: "BookingCode", label: "Booking Code" },
            { key: "Pricing.TotalTBOFare", label: "Total TBO Fare" },
            { key: "Pricing.TotalTBOTax", label: "TBO Tax" },
            { key: "Pricing.OurMarkupPrice", label: "Applied Markup" },
            { key: "Pricing.FinalPrice", label: "Final Price" },
            { key: "Pricing.Currency", label: "Currency" },
            { key: "Status", label: "Booking Status" },
            { key: "Email", label: "Email" },
            { key: "PhoneNumber", label: "Phone" },
          ]}
        />
      </div>
    </div>
  );
}

/* ----------------------------------- COMPONENTS ----------------------------------- */
function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg px-6 py-5 shadow-md`}>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function LatestList({ title, items, fields, height }) {
  return (
    <div className="bg-white shadow-md p-5 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div
        className="space-y-3 overflow-auto pr-2"
        style={{ maxHeight: height }}
      >
        {items?.length === 0 ? (
          <p className="text-sm text-gray-500">No recent data</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="p-3 border rounded-md bg-gray-50 text-sm hover:bg-gray-100 transition"
            >
              {fields.map((f, i) => (
                <p key={i}>
                  <span className="font-semibold">{f.label}: </span>
                  {f.key.toLowerCase().includes("status") ? (
                    <StatusBadge status={getNestedValue(item, f.key)} />
                  ) : (
                    getNestedValue(item, f.key)
                  )}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let bg = "bg-gray-300 text-gray-700";
  if (status?.toLowerCase() === "succeeded") bg = "bg-green-100 text-green-800";
  else if (status?.toLowerCase() === "pending")
    bg = "bg-yellow-100 text-yellow-800";
  else if (status?.toLowerCase() === "failed") bg = "bg-red-100 text-red-800";

  return (
    <span className={`${bg} px-2 py-1 rounded-full text-xs font-semibold`}>
      {status}
    </span>
  );
}

function PaymentCard({
  title,
  currency,
  totalTBOFare,
  totalTBOTax,
  totalMarkup,
  totalFinalPrice,
  payments,
  color,
}) {
  return (
    <div
      className={`${color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300`}
    >
      <p className="text-lg font-semibold mb-4">{title}</p>

      {payments ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {payments.map((p, i) => (
            <div
              key={i}   
              className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white text-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <span className="text-lg font-medium">{p.currency} </span>
              <span className="text-xl font-bold text-[#1A90C8]">
                {p.totalAmount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* <div className="flex justify-between text-sm">
            <span className="font-medium">TBO Fare:</span>
            <span>{currency} {totalTBOFare.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm"> 
            <span className="font-medium">TBO Tax:</span>
            <span>{currency} {totalTBOTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Markup:</span>
            <span>{currency} {totalMarkup.toLocaleString()}</span>
          </div> */}
          <div className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white text-gray-800 hover:shadow-xl transition-shadow duration-300">
            <span className="text-lg font-medium">{currency} </span>
            <span className="text-xl font-bold text-[#1A90C8]">
              {totalFinalPrice}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------- Helper: Safe nested value (like Pricing.FinalPrice) ------- */
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "—";
}
