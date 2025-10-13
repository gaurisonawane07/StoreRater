// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-600">🏪 Store Rater</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-700">Home</Link>

        {!user && (
          <>
            <Link to="/login" className="text-sm text-gray-700">Login</Link>
            <Link to="/register" className="text-sm text-gray-700">Register</Link>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin" className="text-sm text-gray-700">Admin Dashboard</Link>
          </>
        )}

        {user && user.role === "owner" && (
          <>
            <Link to="/owner" className="text-sm text-gray-700">Owner Dashboard</Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={onLogout} className="bg-red-500 text-white text-sm px-3 py-1 rounded">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
