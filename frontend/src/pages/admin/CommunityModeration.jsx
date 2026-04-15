import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function CommunityModeration() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/admin/posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id) => {
    if (!window.confirm("Remove this post permanently?")) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Community Moderation</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-red-100">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900">{post.author?.name}</span>
                <span className="text-[10px] text-slate-400 uppercase">IN {post.course?.title || "GENERAL"}</span>
                <span className="text-[10px] text-slate-300">• {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-inter">{post.content}</p>
            </div>
            
            <button 
              onClick={() => handleDeletePost(post.id)}
              className="px-4 py-2 border border-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
            >
              Delete Post
            </button>
          </div>
        ))}

        {posts.length === 0 && !loading && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No community posts found.
          </div>
        )}
      </div>
    </div>
  );
}
