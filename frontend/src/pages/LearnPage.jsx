import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import LessonList from "../components/LessonList";

export default function LearnPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [progress, setProgress] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // content, ai-summary, ai-quiz
  const [aiData, setAiData] = useState({ summary: "", quiz: null, loading: false });

  const loadProgress = async () => {
    try {
      const res = await api.get(`/progress/${id}`);
      setProgress(res.data);
    } catch (err) {
      console.error("Failed to load progress", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      const [courseRes, enrollmentRes] = await Promise.all([api.get(`/courses/${id}`), api.get("/enrollments/my")]);
      setCourse(courseRes.data);
      setSelectedLesson(courseRes.data.lessons?.[0] || null);
      setAuthorized(enrollmentRes.data.some((e) => e.cohort.courseId === id));
      await loadProgress();
    };
    load().catch(() => setAuthorized(false));
  }, [id]);

  useEffect(() => {
    setAiData({ summary: "", quiz: null, loading: false });
    setActiveTab("content");
  }, [selectedLesson?.id]);

  const fetchAiSummary = async () => {
    if (!selectedLesson || aiData.summary) return;
    setAiData(prev => ({ ...prev, loading: true }));
    try {
      const { data } = await api.get(`/ai/lessons/${selectedLesson.id}/summary`);
      setAiData(prev => ({ ...prev, summary: data.summary, loading: false }));
    } catch (err) {
      alert("AI Summary failed. Check if GROQ_API_KEY is set.");
      setAiData(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchAiQuiz = async () => {
    if (!selectedLesson || aiData.quiz) return;
    setAiData(prev => ({ ...prev, loading: true }));
    try {
      const { data } = await api.get(`/ai/lessons/${selectedLesson.id}/quiz`);
      setAiData(prev => ({ ...prev, quiz: data.questions, loading: false }));
    } catch (err) {
      alert("AI Quiz failed. Check if GROQ_API_KEY is set.");
      setAiData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleComplete = async () => {
    if (!selectedLesson) return;
    setLoadingProgress(true);
    const isCompleted = progress.find((p) => p.lessonId === selectedLesson.id)?.completed;
    try {
      await api.post(`/lessons/${selectedLesson.id}/progress`, { completed: !isCompleted });
      await loadProgress();
    } catch (err) {
      alert("Failed to update progress");
    } finally {
      setLoadingProgress(false);
    }
  };

  const completedLessonIds = useMemo(() => progress.filter((p) => p.completed).map((p) => p.lessonId), [progress]);
  const progressPercent = useMemo(() => {
    if (!course?.lessons?.length) return 0;
    return Math.round((completedLessonIds.length / course.lessons.length) * 100);
  }, [course, completedLessonIds]);

  if (!course) return <p>Loading...</p>;
  if (!authorized) return <p className="text-red-600 p-6">You must be enrolled to access this course.</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit uppercase">{course.title}</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Class Ecosystem</p>
        </div>
        <div className="flex flex-1 items-center gap-4 max-w-md">
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-primary-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="text-sm font-black text-slate-900">{progressPercent}%</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <aside className="rounded-3xl bg-white p-4 h-fit border border-slate-100 shadow-sm">
          <h3 className="mb-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Syllabus</h3>
          <LessonList 
            lessons={course.lessons || []} 
            selectedLessonId={selectedLesson?.id} 
            onSelect={setSelectedLesson} 
            completedIds={completedLessonIds}
          />
        </aside>

        <section className="flex flex-col gap-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between border-b pb-6 mb-8">
              <div className="flex gap-4">
                {["content", "ai-summary", "ai-quiz"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === "ai-summary") fetchAiSummary();
                      if (tab === "ai-quiz") fetchAiQuiz();
                    }}
                    className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                      activeTab === tab 
                        ? "bg-slate-900 text-white shadow-lg" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab === "content" ? "Lesson" : tab === "ai-summary" ? "✨ Summary" : "🧠 Quiz"}
                  </button>
                ))}
              </div>
              <button
                onClick={handleToggleComplete}
                disabled={loadingProgress}
                className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-black transition-all ${
                  completedLessonIds.includes(selectedLesson?.id)
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100"
                }`}
              >
                {completedLessonIds.includes(selectedLesson?.id) ? "✓ COMPLETED" : "MARK COMPLETE"}
              </button>
            </div>

            <div className="min-h-[400px]">
              {aiData.loading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                  <div className="text-4xl mb-4">🌀</div>
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Groq AI is thinking...</p>
                </div>
              ) : activeTab === "content" ? (
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">{selectedLesson?.title}</h2>
                  <p className="whitespace-pre-wrap leading-[1.8] text-slate-600 text-lg font-medium">{selectedLesson?.content}</p>
                </div>
              ) : activeTab === "ai-summary" ? (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-primary-600">✨</span> Golden Nuggets
                  </h2>
                  <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
                    {aiData.summary || "Click the summary tab to generate AI insights."}
                  </div>
                </div>
              ) : (
                <div>
                   <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-primary-600">🧠</span> Knowledge Check
                  </h2>
                  <div className="space-y-6">
                    {aiData.quiz?.map((q, i) => (
                      <div key={i} className="rounded-2xl border border-slate-100 p-6 hover:border-primary-200 transition-colors">
                        <p className="font-bold text-slate-900 mb-4">{i+1}. {q.question}</p>
                        <div className="grid gap-2">
                          {q.options.map((opt, oi) => (
                            <button key={oi} className="text-left rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium hover:bg-white hover:border hover:border-slate-200 transition-all">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
