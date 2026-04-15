export default function LessonList({ lessons, selectedLessonId, onSelect, completedIds = [] }) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={() => onSelect(lesson)}
          className={`group flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-all ${
            selectedLessonId === lesson.id ? "bg-primary-100 text-primary-700 font-bold" : "bg-white hover:bg-slate-50"
          }`}
        >
          <span className="truncate">
            {lesson.order}. {lesson.title}
          </span>
          {completedIds.includes(lesson.id) && (
            <span className="text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
