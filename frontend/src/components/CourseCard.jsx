import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border bg-white p-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-video w-full rounded-[24px] bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black text-white uppercase backdrop-blur-md">Class ecosystem</span>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-500 leading-relaxed font-inter">{course.description}</p>
        
        <div className="mt-6 flex items-center justify-between">
          <Link to={`/creator/${course.creatorId}`} className="flex items-center gap-2 group/creator">
             <div className="h-6 w-6 rounded-full bg-slate-200" />
             <span className="text-xs font-bold text-slate-400 group-hover/creator:text-primary-600 transition-colors uppercase tracking-widest">{course.creator?.name}</span>
          </Link>
          <Link 
            to={`/courses/${course.id}`} 
            className="rounded-full bg-slate-900 px-5 py-2 text-[10px] font-black text-white hover:bg-primary-600 transition-colors uppercase"
          >
            Go to Class
          </Link>
        </div>
      </div>
    </div>
  );
}
