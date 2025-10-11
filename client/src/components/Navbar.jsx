import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white flex justify-between px-6 py-3">
      <h1 className="font-bold text-xl">🏪 Store Rater</h1>
      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (
          <>
            {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            {user.role === "owner" && <Link to="/owner">Owner Dashboard</Link>}
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
