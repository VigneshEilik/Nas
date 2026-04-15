import { useEffect, useState } from "react";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api.get(`/courses?search=${query}`).then((res) => {
        setCourses(res.data.courses || []);
        setLoading(false);
      });
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Explore Courses</h1>
      </div>
      
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none" 
          placeholder="What do you want to learn today?" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          {courses.length === 0 && <p className="col-span-full text-center py-20 text-slate-500">No courses found matching your search.</p>}
        </div>
      )}
    </div>
  );
}
