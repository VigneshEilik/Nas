export default function PostCard({ post, onSelect, onToggleLike }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:border-primary-100 transition-colors">
      <div className="cursor-pointer" onClick={() => onSelect(post)}>
        <div className="flex items-center gap-3">
          {post.author?.avatar && <img src={post.author.avatar} className="h-8 w-8 rounded-full border" alt="" />}
          <div>
            <p className="text-sm font-bold text-slate-900">{post.author?.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{post.course?.title || "General"}</p>
          </div>
        </div>
        <p className="mt-4 text-slate-700 leading-relaxed font-medium">{post.content}</p>
      </div>
      
      <div className="mt-5 flex items-center gap-4 border-t pt-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(post.id);
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
            post.isLiked ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          <span>{post.isLiked ? "❤️" : "🤍"}</span>
          <span>{post.likeCount || 0}</span>
        </button>
        
        <button 
          onClick={() => onSelect(post)}
          className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all font-inter"
        >
          <span>💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>
    </div>
  );
}
