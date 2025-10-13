// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState("");
  const [addr, setAddr] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name or rating
  const [sortDir, setSortDir] = useState("asc");
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        q: q || undefined,
        address: addr || undefined,
        sortBy,
        sortDir,
        limit: 50,
      };
      const res = await api.get("/stores", { params });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, [sortBy, sortDir]);

  const handleRating = async (storeId, rating) => {
    if (!token) return alert("Please login to rate");
    try {
      await api.post("/ratings", { store_id: storeId, rating });
      await fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || "Rating failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" className="border p-2 rounded" />
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Search by address" className="border p-2 rounded" />
          <button onClick={fetchStores} className="bg-blue-600 text-white px-4 rounded">Search</button>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm">Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="name">Name</option>
            <option value="rating">Avg Rating</option>
          </select>
          <button onClick={() => setSortDir((s) => (s === "asc" ? "desc" : "asc"))} className="border p-2 rounded">
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : null}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stores.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.address}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 font-bold">⭐ {s.avg_rating ?? 0}</div>
                <div className="text-xs text-gray-500">Your rating: {s.my_rating ?? "-"}</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {[1,2,3,4,5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRating(s.id, r)}
                  className={`px-2 py-1 rounded border ${s.my_rating === r ? "bg-yellow-400 text-white" : "hover:bg-yellow-50"}`}
                >
                  {r}⭐
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && !loading && <div className="mt-8 text-gray-500">No stores found.</div>}
    </div>
  );
}
