import React, { useState, useEffect, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Home() {
  const { token, user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (!user) return; // wait until user is loaded
    if (user.role === "admin") fetchDashboard();
    else fetchStores();
  }, [user]);

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Fetch stores error:", err);
      toast.error("Failed to load stores");
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(res.data);
    } catch (err) {
      console.error("Fetch dashboard error:", err);
      toast.error("Failed to load dashboard");
    }
  };

  const handleRate = async (storeId, rating) => {
    if (!token) return toast.error("Please login to rate a store");
    try {
      await api.post(
        "/ratings",
        { store_id: storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rating submitted!");
      fetchStores();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/stores", newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store added successfully!");
      setNewStore({ name: "", address: "", description: "" });
      fetchStores();
    } catch (err) {
      console.error("Add store error:", err);
      toast.error(err.response?.data?.error || "Failed to add store");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        <p>Loading user info...</p>
      </div>
    );
  }
  console.log("🔍 Current logged-in user:", user);
  console.log("🔍 Token:", token);

  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Admin Dashboard
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardCard title="Users" value={dashboard.totalUsers} color="blue" />
          <DashboardCard title="Stores" value={dashboard.totalStores} color="green" />
          <DashboardCard title="Ratings" value={dashboard.totalRatings} color="yellow" />
        </div>
      </div>
    );
  }

  if (user.role === "owner") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Owner Dashboard
        </h1>

        {/* Add store form */}
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Store
          </h2>
          <form onSubmit={handleAddStore} className="space-y-3">
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
              required
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Description"
              value={newStore.description}
              onChange={(e) =>
                setNewStore({ ...newStore, description: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Add Store
            </button>
          </form>
        </div>

        {/* Store List */}
        <StoreList stores={stores} />
      </div>
    );
  }

  // Default: User view
  return (
    <StoreList stores={stores} handleRate={handleRate} user={user} />
  );
}

// Reusable small components
function DashboardCard({ title, value, color }) {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
  }[color];
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold ${colorClass}`}>{value || 0}</p>
    </div>
  );
}

function StoreList({ stores, handleRate, user }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Stores
      </h1>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length === 0 ? (
          <p className="text-gray-500">No stores available.</p>
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {store.name}
              </h3>
              <p className="text-gray-500 mb-2">{store.address}</p>
              <p className="text-yellow-500 mb-3 font-semibold">
                ⭐ Average Rating: {store.avg_rating || 0}
              </p>

              {user?.role === "user" && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRate(store.id, num)}
                      className="px-2 text-xl hover:scale-110 transition"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
