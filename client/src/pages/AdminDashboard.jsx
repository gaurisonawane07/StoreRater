import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";


function AddStoreModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", address: "", owner_email: "" });
  useEffect(() => {
    if (!open) setForm({ name: "", address: "", owner_email: "" });
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let ownerId = null;
      if (form.owner_email) {
        const r = await api.get("/admin/users", { params: { email: form.owner_email, limit: 1 } });
        const found = r.data.users?.[0];
        if (found) ownerId = found.id;
      }
      const payload = { name: form.name, address: form.address, owner_id: ownerId };
      await api.post("/admin/stores", payload);
      alert("Store created successfully!");
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create store");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-fadeIn"
      >
        <h3 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          Add New Store
        </h3>
        <input
          required
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="owner_email"
          placeholder="Owner Email (optional)"
          value={form.owner_email}
          onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
          className="w-full border p-2 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

function AddUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  useEffect(() => {
    if (!open)
      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      try {
        await api.post("/admin/users", { ...form });
      } catch {
        await api.post("/auth/register", form);
      }
      alert("User created successfully!");
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create user");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white to-indigo-50 shadow-2xl rounded-2xl p-6 w-full max-w-md animate-fadeIn"
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">
          Add New User
        </h3>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-2 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

function TableWrapper({ title, filter, setFilter, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-200 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
        <input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {children}
    </div>
  );
}


export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [openAddStore, setOpenAddStore] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("");

  const loadAll = async () => {
    try {
      const [d, u, s] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users", { params: { limit: 200 } }),
        api.get("/admin/stores", { params: { limit: 200 } }),
      ]);
      setSummary(d.data);
      setUsers(u.data.users || []);
      setStores(s.data.stores || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userFilter.toLowerCase()) ||
      u.email?.toLowerCase().includes(userFilter.toLowerCase()) ||
      u.role?.toLowerCase().includes(userFilter.toLowerCase())
  );

  const filteredStores = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(storeFilter.toLowerCase()) ||
      s.address?.toLowerCase().includes(storeFilter.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ⚙️ Admin Dashboard
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setOpenAddStore(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            + Add Store
          </button>
          <button
            onClick={() => setOpenAddUser(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Users" value={summary.totalUsers} color="blue" />
        <SummaryCard title="Total Stores" value={summary.totalStores} color="green" />
        <SummaryCard title="Total Ratings" value={summary.totalRatings} color="yellow" />
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-8">
        <TableWrapper title="Users" filter={userFilter} setFilter={setUserFilter}>
          <UserTable users={filteredUsers} />
        </TableWrapper>
        <TableWrapper title="Stores" filter={storeFilter} setFilter={setStoreFilter}>
          <StoreTable stores={filteredStores} />
        </TableWrapper>
      </div>

      {/* Modals */}
      <AddStoreModal open={openAddStore} onClose={() => setOpenAddStore(false)} onCreated={loadAll} />
      <AddUserModal open={openAddUser} onClose={() => setOpenAddUser(false)} onCreated={loadAll} />
    </div>
  );
}

/* --- SummaryCard --- */
function SummaryCard({ title, value, color }) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-400 to-yellow-500",
  };
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${colorMap[color]} text-white transform hover:scale-105 transition duration-200`}
    >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-4xl font-bold">{value ?? 0}</div>
    </div>
  );
}

/* --- Tables --- */
function UserTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      u.role === "admin"
                        ? "bg-blue-600"
                        : u.role === "owner"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StoreTable({ stores }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-2">Name</th>
            <th>Address</th>
            <th>Owner</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{s.name}</td>
                <td>{s.address}</td>
                <td>{s.owner_id ?? "-"}</td>
                <td className="text-yellow-500 font-semibold">
                  ⭐ {s.rating ?? s.avg_rating ?? 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
                No stores found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
