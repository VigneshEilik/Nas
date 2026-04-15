import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
  }, [id]);

  const enroll = async (cohortId) => {
    try {
      await api.post("/enrollments", { cohortId });
      setMessage("Enrolled successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (!course) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="mt-2 text-slate-600">{course.description}</p>
        <Link className="mt-4 inline-block rounded bg-primary-600 px-4 py-2 text-white" to={`/courses/${id}/learn`}>Start learning</Link>
      </div>
      {message && <p className="text-sm text-primary-700">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="font-semibold">Lessons</h2>
          <ul className="mt-2 space-y-2 text-sm">{course.lessons.map((l) => <li key={l.id}>{l.order}. {l.title}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="font-semibold">Cohorts</h2>
          <div className="mt-2 space-y-2">
            {course.cohorts.map((c) => (
              <div key={c.id} className="rounded border p-3">
                <p className="text-sm">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
                <button onClick={() => enroll(c.id)} className="mt-2 rounded bg-primary-600 px-3 py-1 text-sm text-white">Enroll</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
