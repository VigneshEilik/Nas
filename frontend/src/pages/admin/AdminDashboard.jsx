import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setStats(data);
      } catch (err) {
        console.error("Dashboard failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, color: "bg-blue-500" },
    { label: "Students", value: stats.totalStudents, color: "bg-green-500" },
    { label: "Creators", value: stats.totalCreators, color: "bg-purple-500" },
    { label: "Courses", value: stats.totalCourses, color: "bg-orange-500" },
    { label: "Active Cohorts", value: stats.activeCohorts, color: "bg-pink-500" },
    { label: "Total Enrollments", value: stats.totalEnrollments, color: "bg-indigo-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-xl ${card.color} bg-opacity-10 flex items-center justify-center text-xl`}>
              {card.label.includes("User") ? "👤" : card.label.includes("Course") ? "📚" : "📈"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700">
              ✉️ Send Bulk Notification to Students
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700">
              📥 Export Platform Data (CSV)
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700">
              🛠️ Maintenance Mode Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
