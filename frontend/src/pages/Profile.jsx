import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", bio: "", avatar: "", email: "", role: "" });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/profile/me").then((res) => setProfile(res.data));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/upload", formData);
      setProfile((prev) => ({ ...prev, avatar: data.url }));
      setMessage("Image uploaded!");
    } catch (err) {
      alert("Upload failed. Make sure Cloudinary keys are set in .env");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/profile/me", {
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar
    });
    setProfile(data);
    setMessage("Profile updated");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <form onSubmit={save} className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-6">
          <div className="relative h-24 w-24 flex-shrink-0">
            <img 
              src={profile.avatar || "https://res.cloudinary.com/dzt6v3f1o/image/upload/v1/nas-academy/avatar_placeholder"} 
              className="h-full w-full rounded-full border-4 border-primary-50 object-cover shadow-sm transition-transform hover:scale-105" 
              alt="Avatar" 
            />
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-slate-900 p-2 text-white shadow-lg hover:bg-primary-600 transition-colors">
              <span className="text-xs">📸</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-outfit uppercase">Account Settings</h1>
            <p className="text-sm font-semibold text-primary-600">{profile.email} • <span className="text-slate-400 capitalize">{profile.role.toLowerCase()}</span></p>
          </div>
        </div>

        {uploading && <p className="mb-4 text-xs font-bold text-primary-600 animate-pulse">Uploading to Cloudinary...</p>}

        <div className="space-y-6">
          <div className="group border-b border-slate-100 hover:border-primary-300 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Full Name</p>
            <input 
              className="w-full bg-transparent py-2 text-lg font-medium outline-none" 
              value={profile.name || ""} 
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
            />
          </div>

          <div className="group border-b border-slate-100 hover:border-primary-300 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Public Bio</p>
            <textarea 
              className="w-full bg-transparent py-2 text-lg font-medium outline-none min-h-[100px]" 
              placeholder="Tell your story..." 
              value={profile.bio || ""} 
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
            />
          </div>

          <button className="w-full rounded-2xl bg-primary-600 py-4 text-sm font-black text-white shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all">
            Commit Changes
          </button>
        </div>

        {message && <p className="mt-4 text-center text-sm font-bold text-green-600">{message}</p>}
      </form>

      <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white">
        <h3 className="text-lg font-bold mb-2">Nas Premium Tip 🌟</h3>
        <p className="text-slate-400 text-sm leading-relaxed font-inter">
          Profiles with a clear avatar and detailed bio receive 40% more engagement in the creator community. Stay recognizable!
        </p>
      </div>
    </div>
  );
}
