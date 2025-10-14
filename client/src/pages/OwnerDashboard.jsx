import React, { useState, useEffect, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: "", address: "" });

  useEffect(() => {
    if (user?.role === "owner") {
      fetchStores();
    }
  }, [user]);

  const fetchStores = async () => {
    try {
      const res = await api.get("/owner/stores/ratings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      toast.error("Failed to fetch stores");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/stores",
        { name: form.name, address: form.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Store added successfully!");
      setForm({ name: "", address: "" });
      fetchStores();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add store");
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Please log in to continue.
      </div>
    );
  }

  if (user.role !== "owner") {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Access denied — Only owners can access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Owner Dashboard
      </h1>

      
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Store
        </h2>
        <input
          name="name"
          placeholder="Store Name"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Store
        </button>
      </form>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">
          Your Stores
        </h2>
        {stores.length === 0 ? (
          <p className="text-gray-500">No stores added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white shadow-md p-4 rounded-lg border"
              >
                <h3 className="text-lg font-semibold text-blue-600">
                  {store.name}
                </h3>
                <p className="text-gray-500">{store.address}</p>
                <p className="mt-2 text-yellow-500 font-semibold">
                  ⭐ Average Rating: {store.average_rating || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 