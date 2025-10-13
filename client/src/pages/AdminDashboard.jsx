// src/pages/AdminDashboard.jsx
import { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

/* --- AddStoreModal --- */
function AddStoreModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", address: "", owner_email: "" });
  useEffect(() => { if (!open) setForm({ name: "", address: "", owner_email: "" }); }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // backend expects owner_id; we try by email: find user first
      let ownerId = null;
      if (form.owner_email) {
        const r = await api.get("/admin/users", { params: { email: form.owner_email, limit: 1 } });
        const found = r.data.users?.[0];
        if (found) ownerId = found.id;
      }
      const payload = { name: form.name, address: form.address, owner_id: ownerId };
      await api.post("/admin/stores", payload);
      alert("Store created");
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create store");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New Store</h3>
        <input required name="name" placeholder="Store name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <input name="address" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <input name="owner_email" placeholder="Owner email (optional)" value={form.owner_email} onChange={(e)=>setForm({...form, owner_email:e.target.value})} className="w-full border p-2 rounded mb-4" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  );
}

/* --- AddUserModal --- */
function AddUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  useEffect(()=>{ if(!open) setForm({ name: "", email: "", password: "", address: "", role: "user" }) }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Try admin create user endpoint first
      try {
        await api.post("/admin/users", { ...form }); // backend may or may not support
      } catch (err) {
        // fallback: use public register (if register accepts role)
        await api.post("/auth/register", form);
      }
      alert("User created");
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create user");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
        <input required name="name" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <input required name="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <input required name="password" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <input name="address" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} className="w-full border p-2 rounded mb-2" />
        <select name="role" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="w-full border p-2 rounded mb-4">
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  );
}

/* --- Users Table --- */
function UsersTable({ users, onRefresh }) {
  const [filter, setFilter] = useState("");
  const filtered = users.filter(u =>
    (u.name||"").toLowerCase().includes(filter.toLowerCase()) ||
    (u.email||"").toLowerCase().includes(filter.toLowerCase()) ||
    (u.role||"").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Users</h4>
        <input placeholder="Filter name/email/role" value={filter} onChange={(e)=>setFilter(e.target.value)} className="border p-1 rounded" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No users</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- Stores Table --- */
function StoresTable({ stores }) {
  const [filter, setFilter] = useState("");
  const filtered = stores.filter(s =>
    (s.name||"").toLowerCase().includes(filter.toLowerCase()) ||
    (s.address||"").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Stores</h4>
        <input placeholder="Filter name/address" value={filter} onChange={(e)=>setFilter(e.target.value)} className="border p-1 rounded" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="py-2">Name</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t">
                <td className="py-2">{s.name}</td>
                <td>{s.address}</td>
                <td>{s.owner_id ?? "-"}</td>
                <td>{s.rating ?? s.avg_rating ?? 0}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No stores</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- AdminDashboard main export --- */
export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [openAddStore, setOpenAddStore] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);

  const loadAll = async () => {
    try {
      const [d,u,s] = await Promise.all([
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

  useEffect(()=>{ loadAll(); }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={()=>setOpenAddStore(true)} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Store</button>
          <button onClick={()=>setOpenAddUser(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add User</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold">{summary.totalUsers ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Total Stores</div>
          <div className="text-2xl font-bold">{summary.totalStores ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Total Ratings</div>
          <div className="text-2xl font-bold">{summary.totalRatings ?? 0}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <UsersTable users={users} onRefresh={loadAll} />
        <StoresTable stores={stores} />
      </div>

      <AddStoreModal open={openAddStore} onClose={()=>setOpenAddStore(false)} onCreated={loadAll} />
      <AddUserModal open={openAddUser} onClose={()=>setOpenAddUser(false)} onCreated={loadAll} />
    </div>
  );
}
