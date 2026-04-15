import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

export default function CreatorProfile() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/profile/${id}`);
        setCreator(data);
        const courseRes = await api.get(`/courses?creatorId=${id}`);
        setCourses(courseRes.data.courses || []);
      } catch (err) {
        console.error("Failed to load creator profile", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 uppercase font-black tracking-widest">Loading Creator Ecosystem...</div>;
  if (!creator) return <div className="p-20 text-center text-red-500 font-bold uppercase">Creator not found</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-6">
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-600/20 to-transparent" />
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start text-center md:text-left">
          <img 
            src={creator.avatar || "https://res.cloudinary.com/dzt6v3f1o/image/upload/v1/nas-academy/avatar_placeholder"} 
            className="h-40 w-40 rounded-full border-8 border-slate-800 object-cover shadow-2xl transition-transform hover:scale-105" 
            alt={creator.name} 
          />
          <div className="space-y-4">
            <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter">{creator.name}</h1>
            <p className="max-w-2xl text-xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-primary-500 pl-6">
              {creator.bio || "Passionate creator sharing knowledge with the global ecosystem."}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <span className="rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-primary-400 border border-slate-700">🚀 {courses.length} Classes</span>
               <span className="rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-slate-300 border border-slate-700">🌟 Top Creator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Courses by {creator.name}</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {courses.length === 0 && (
          <div className="py-20 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No active courses published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
