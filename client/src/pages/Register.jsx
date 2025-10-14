// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     address: ""
//   });
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/register", form);
//       login(res.data.user, res.data.token);
//       toast.success("Registration successful!");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//           Create an Account
//         </h2>

//         <input
//           name="name"
//           placeholder="Full Name"
//           className="w-full border p-2 mb-3 rounded"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 mb-3 rounded"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 mb-3 rounded"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="address"
//           placeholder="Address"
//           className="w-full border p-2 mb-4 rounded"
//           value={form.address}
//           onChange={handleChange}
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      login(res.data.user, res.data.token);

      toast.success("Registration successful!");

      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "owner") navigate("/owner");
      else navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Create an Account
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.address}
          onChange={handleChange}
        />

        {/* 🔹 Role Dropdown */}
        <label className="block text-gray-700 mb-1 font-medium">
          Register as:
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition transform hover:scale-105"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
