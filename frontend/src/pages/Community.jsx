import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import CommentBox from "../components/CommentBox";

const socket = io("http://localhost:5000");

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");

  const load = async (page = 1) => {
    const { data } = await api.get(`/community/posts?page=${page}`);
    setPosts(data.posts || []);
    if (selectedPost) {
      const updated = data.posts.find((p) => p.id === selectedPost.id);
      setSelectedPost(updated || null);
    }
  };

  useEffect(() => {
    load();
    
    socket.on("new-post", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    socket.on("new-comment", ({ postId, comment }) => {
      setPosts((prev) => prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), comment], commentCount: (p.commentCount || 0) + 1 };
        }
        return p;
      }));
      
      setSelectedPost((prev) => {
        if (prev?.id === postId) {
          return { ...prev, comments: [...(prev.comments || []), comment], commentCount: (prev.commentCount || 0) + 1 };
        }
        return prev;
      });
    });

    return () => {
      socket.off("new-post");
      socket.off("new-comment");
    };
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post("/community/posts", { content });
    setContent("");
    await load();
  };

  const addComment = async (commentContent) => {
    if (!selectedPost) return;
    await api.post(`/community/posts/${selectedPost.id}/comments`, { content: commentContent });
    await load();
  };

  const handleToggleLike = async (postId) => {
    try {
      // Optimistic Update
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? (p.likeCount || 1) - 1 : (p.likeCount || 0) + 1
            };
          }
          return p;
        })
      );

      await api.post(`/posts/${postId}/like`);
      // Optional: reload if you want absolute sync, but optimistic is better for UX
    } catch (err) {
      console.error("Failed to toggle like", err);
      load(); // Rollback on error
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
      <section className="space-y-4">
        <form onSubmit={createPost} className="rounded-xl bg-white p-4 shadow">
          <textarea className="w-full rounded border p-3" placeholder="Share something with the community..." value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="mt-3 rounded bg-primary-600 px-4 py-2 text-white">Post</button>
        </form>
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onSelect={setSelectedPost} 
            onToggleLike={handleToggleLike}
          />
        ))}
      </section>
      <aside className="rounded-3xl border bg-white p-6 shadow-xl h-fit sticky top-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Discussion</h2>
        {!selectedPost ? (
          <div className="py-10 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-sm font-semibold text-slate-400">Select a post to join the conversation.</p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-300px)]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedPost.comments?.map((comment) => (
                <div key={comment.id} className="group relative rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100">
                  <div className="mb-2 flex items-center gap-2">
                    {comment.author?.avatar ? (
                      <img src={comment.author.avatar} className="h-5 w-5 rounded-full border border-white" alt="" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-slate-200" />
                    )}
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{comment.author?.name}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">{comment.content}</p>
                </div>
              ))}
              {selectedPost.comments?.length === 0 && (
                <p className="py-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">No comments yet</p>
              )}
            </div>
            
            <div className="mt-6 border-t pt-6">
              <CommentBox onSubmit={addComment} />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
