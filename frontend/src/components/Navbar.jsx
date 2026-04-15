import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold text-primary-600">Nas Clone</Link>
        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/community">Community</Link>
              <Link to="/profile">{user?.name || "Profile"}</Link>
              <button onClick={logout} className="rounded bg-primary-600 px-3 py-1 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="rounded bg-primary-600 px-3 py-1 text-white">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
