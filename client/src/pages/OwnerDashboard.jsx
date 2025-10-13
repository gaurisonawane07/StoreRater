// src/pages/OwnerDashboard.jsx
import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { token } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/owner/stores/ratings");
      setStores(res.data.stores || []);
    } catch (err) {
      alert("Failed to load owner data");
    }
  };

  useEffect(()=>{ load(); }, []);

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/password", { oldPassword, newPassword });
      alert("Password updated");
      setOldPassword(""); setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Owner Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {stores.map(s => (
          <div key={s.store.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{s.store.name}</h3>
            <div className="text-yellow-500">⭐ Avg: {s.averageRating || 0}</div>
            <ul className="mt-3 list-disc ml-5">
              {s.ratings.map(r => <li key={r.id}>{r.name} — {r.rating}⭐</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow max-w-md">
        <h4 className="font-semibold mb-3">Update Password</h4>
        <form onSubmit={updatePassword} className="flex flex-col gap-2">
          <input type="password" placeholder="Old password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} className="border p-2 rounded" required />
          <input type="password" placeholder="New password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="border p-2 rounded" required />
          <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Update</button>
        </form>
      </div>
    </div>
  );
}
