import { useState } from "react";

export default function CommentBox({ onSubmit }) {
  const [content, setContent] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
      }}
      className="mt-3 flex gap-2"
    >
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded border px-3 py-2"
      />
      <button className="rounded bg-primary-600 px-3 py-2 text-white">Send</button>
    </form>
  );
}
