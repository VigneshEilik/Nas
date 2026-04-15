import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function CourseModeration() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/admin/courses", { params: { status: statusFilter } });
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/courses/${id}/status`, { status });
      fetchCourses();
    } catch (err) {
      alert("Failed to update course");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Course Moderation</h1>
        <div className="flex bg-white rounded-xl border p-1 border-slate-200">
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500">By {course.creator?.name}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                course.status === "PENDING" ? "bg-orange-100 text-orange-600" :
                course.status === "APPROVED" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {course.status}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-3 flex-1 mb-6">
              {course.description}
            </p>

            <div className="flex gap-2">
              {course.status !== "APPROVED" && (
                <button 
                  onClick={() => handleUpdateStatus(course.id, "APPROVED")}
                  className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Approve Course
                </button>
              )}
              {course.status !== "REJECTED" && (
                <button 
                  onClick={() => handleUpdateStatus(course.id, "REJECTED")}
                  className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}

        {courses.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            No courses found with status: {statusFilter.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  );
}
