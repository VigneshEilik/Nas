import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await api.post("/auth/google", { 
        credential: response.credential 
      });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="text-sm text-slate-500 mb-6">Welcome back to Nas Academy Clone</p>
        
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        
        <div className="space-y-4">
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 outline-none transition-all" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 outline-none transition-all" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
          Login
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => setError("Google Authentication Failed")}
            useOneTap
            shape="pill"
            theme="outline"
          />
        </div>
      </form>
    </div>
  );
}
