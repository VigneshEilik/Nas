import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses?limit=3").then((res) => {
      setCourses(res.data.courses || []);
      setLoading(false);
    }).catch(() => {
      setCourses([]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-slate-900 px-8 py-20 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl text-center md:text-left">
          <span className="mb-4 inline-block rounded-full bg-primary-500/20 px-4 py-1 text-xs font-black uppercase tracking-widest text-primary-400 border border-primary-500/30">
            The Future of Learning
          </span>
          <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter sm:text-7xl leading-[0.9]">
            Learn from <br/> <span className="text-primary-500">World-Class</span> <br/> Creators.
          </h1>
          <p className="mt-8 text-xl font-medium text-slate-400 leading-relaxed font-inter max-w-xl">
            Build real skills with cohorts, interactive lessons, and a global community of experts. No fluff. Just growth.
          </p>
          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/register" className="rounded-full bg-primary-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-primary-900/20 hover:bg-primary-700 active:scale-[0.98] transition-all uppercase">
              Start Your Journey
            </Link>
            <Link to="/courses" className="rounded-full bg-white/10 px-10 py-4 text-sm font-black text-white backdrop-blur-md hover:bg-white/20 transition-all uppercase border border-white/10">
              Explore Ecosystem
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="space-y-10 px-4">
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 font-inter">Curated Excellence</h2>
            <h3 className="text-3xl font-black text-slate-900 uppercase font-outfit tracking-tighter">Featured Classes</h3>
          </div>
          <Link to="/courses" className="text-xs font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             {[1, 2, 3].map(i => <div key={i} className="aspect-video rounded-[32px] bg-slate-50 animate-pulse border border-slate-100" />)}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="rounded-[40px] bg-slate-50 p-12 text-center border border-slate-100">
         <h2 className="text-xl font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by 1M+ Learners</h2>
         <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
            {/* Logo Placeholders */}
            <div className="text-2xl font-black font-outfit italic tracking-tighter">CREATOR.CO</div>
            <div className="text-2xl font-black font-outfit tracking-tighter">NAS.HUB</div>
            <div className="text-2xl font-black font-outfit italic tracking-tighter">SKILL.UP</div>
            <div className="text-2xl font-black font-outfit tracking-tighter">NEXT.EDU</div>
         </div>
      </section>
    </div>
  );
}
