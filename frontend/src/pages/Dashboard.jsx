import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({ courseId: "", title: "", content: "", order: 1 });
  const [cohortForm, setCohortForm] = useState({ courseId: "", startDate: "", endDate: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const endpoint = user?.role === "CREATOR" ? "/dashboard/creator" : "/dashboard/student";
    const res = await api.get(endpoint);
    setData(res.data);
  };

  useEffect(() => {
    if (user?.role) {
      load().catch(() => setData([]));
    }
  }, [user?.role]);

  const createCourse = async (e) => {
    e.preventDefault();
    await api.post("/courses", form);
    setForm({ title: "", description: "" });
    setMessage("Course created");
    await load();
  };

  const createLesson = async (e) => {
    e.preventDefault();
    await api.post("/lessons", { ...lessonForm, order: Number(lessonForm.order) });
    setLessonForm({ courseId: "", title: "", content: "", order: 1 });
    setMessage("Lesson created");
    await load();
  };

  const createCohort = async (e) => {
    e.preventDefault();
    await api.post("/cohorts", cohortForm);
    setCohortForm({ courseId: "", startDate: "", endDate: "" });
    setMessage("Cohort created");
    await load();
  };

  if (user?.role === "STUDENT") {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">My Learning</h1>
          <p className="text-sm font-medium text-slate-500">Active Enrollments: {data.length}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {data.map((e) => (
            <div key={e.id} className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {e.cohort.course.creator?.name}'s Course
                </span>
                <h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase">{e.cohort.course.title}</h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Course Progress</span>
                  <span className="font-bold text-slate-900">{e.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-primary-600 transition-all duration-700" style={{ width: `${e.progressPercent}%` }}></div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="text-xs text-slate-400">
                  Cohort: {new Date(e.cohort.startDate).toLocaleDateString()}
                </span>
                <a href={`/learn/${e.cohort.courseId}`} className="text-sm font-bold text-primary-600 hover:underline">
                  Continue Learning →
                </a>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="col-span-full py-20 text-center text-slate-500">You haven't enrolled in any courses yet.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900">Creator Hub</h1>
        <div className="flex gap-4">
          <button className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
            + New Course
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Your Production</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.map((course) => (
              <div key={course.id} className="rounded-2xl border bg-white p-5 shadow-sm hover:border-primary-100 transition-all">
                <h3 className="font-bold text-slate-900 uppercase">{course.title}</h3>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Lessons</p>
                    <p className="font-bold text-primary-600">{course.lessonCount}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Students</p>
                    <p className="font-bold text-primary-600">{course.enrollmentCount}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Posts</p>
                    <p className="font-bold text-primary-600">{course.postCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
            <form onSubmit={createCourse} className="space-y-4">
              <div className="group border-b border-white hover:border-primary-200 transition-all">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">New Course Title</p>
                <input className="w-full bg-transparent py-2 text-lg font-medium outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <textarea className="w-full rounded-xl bg-slate-50 p-3 text-sm outline-none border border-transparent focus:border-slate-200 transition-all" rows={3} placeholder="Tell us what students will learn..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors">Launch Course</button>
            </form>
          </div>

          <div className="rounded-2xl border bg-slate-900 p-6 text-white shadow-xl">
             <h2 className="mb-4 text-xl font-bold">Nas Scale Tip 💡</h2>
             <p className="text-sm text-slate-300 leading-relaxed font-inter">
               Maintain excitement by adding at least 2 community posts per week to your active cohorts. Consistency builds ecosystems!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
