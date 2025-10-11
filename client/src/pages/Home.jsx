import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [stores, setStores] = useState([]);
  const { token, user } = useContext(AuthContext);

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRating = async (storeId, rating) => {
    if (!token) {
      alert("Please login to rate");
      return;
    }
    try {
      await api.post(
        "/ratings",
        { store_id: storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted!");
      fetchStores(); // refresh ratings
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting rating");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">All Stores</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stores.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow p-4 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.address}</p>
            <p className="mt-2 text-yellow-500">
              ⭐ {s.avg_rating || 0}
            </p>

            {user?.role === "user" && (
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRating(s.id, r)}
                    className={`px-3 py-1 border rounded ${
                      s.my_rating === r
                        ? "bg-yellow-400 text-white"
                        : "hover:bg-yellow-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
