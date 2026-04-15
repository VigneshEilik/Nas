import React from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user || user.role !== "ADMIN") return <Navigate to="/" />;

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: "📊" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Courses", path: "/admin/courses", icon: "📚" },
    { label: "Community", path: "/admin/community", icon: "💬" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary-400">NAS</span> ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/dashboard" className="text-xs text-slate-500 hover:text-slate-300">
            ← Back to Student Hub
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
