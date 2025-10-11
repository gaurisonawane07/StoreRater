import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { token } = useContext(AuthContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api
      .get("/owner/stores/ratings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStores(res.data.stores || []))
      .catch(() => alert("Failed to load owner data"));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Owner Dashboard
      </h2>
      {stores.map((s) => (
        <div
          key={s.store.id}
          className="bg-white shadow p-4 mb-4 rounded-lg"
        >
          <h3 className="font-semibold">{s.store.name}</h3>
          <p className="text-yellow-500 mb-2">
            ⭐ Avg Rating: {s.averageRating}
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {s.ratings.map((r) => (
              <li key={r.id}>
                {r.name} — {r.rating}⭐
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
