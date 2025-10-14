import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!user && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [user, setUser]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🏪 Store Rater
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">
          Home
        </Link>

        {!token && (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-sm text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}

        {/* Admin */}
        {user && user.role === "admin" && (
          <Link to="/admin" className="text-sm text-gray-700 hover:text-blue-600">
            Admin Dashboard
          </Link>
        )}

        {/* Owner */}
        {user && user.role === "owner" && (
          <Link to="/owner" className="text-sm text-gray-700 hover:text-blue-600">
            Owner Dashboard
          </Link>
        )}

        {token && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Hi, {user?.name?.split(" ")[0] || "User"}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
