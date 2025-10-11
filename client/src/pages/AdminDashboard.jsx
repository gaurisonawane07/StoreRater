import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({});

  useEffect(() => {
    api
      .get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => alert("Failed to load dashboard"));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Admin Dashboard
      </h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-2xl font-bold">{data.totalUsers || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Stores</h3>
          <p className="text-2xl font-bold">{data.totalStores || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Ratings</h3>
          <p className="text-2xl font-bold">{data.totalRatings || 0}</p>
        </div>
      </div>
    </div>
  );
}
