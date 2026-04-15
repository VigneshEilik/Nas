import { Route, Routes, Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LearnPage from "./pages/LearnPage";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import CreatorProfile from "./pages/CreatorProfile";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseModeration from "./pages/admin/CourseModeration";
import CommunityModeration from "./pages/admin/CommunityModeration";

export default function App() {
  const GOOGLE_CLIENT_ID = "946560795537-bcq2r5033cql0sp14o6uqdnrfambas0l.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen">
        <Routes>
          {/* Public/Student Routes WITH Navbar */}
          <Route element={<><Navbar /><main className="mx-auto max-w-6xl px-4 py-6"><Outlet /></main></>}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/courses/:id/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/creator/:id" element={<ProtectedRoute><CreatorProfile /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes WITHOUT public Navbar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseModeration />} />
            <Route path="community" element={<CommunityModeration />} />
          </Route>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}
