import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProtectedRoute } from "@/components/auth-protected-route";
import { HomePage } from "@/pages/home";
import { Dashboard } from "@/pages/dashboard";
import { ImageEditor } from "@/pages/image-editor";
import { VideoGenerator } from "@/pages/video-generator";
import { AudioChat } from "@/pages/audio-chat";
import { ImageGenerator } from "@/pages/image-generator";
import { Pricing } from "@/pages/pricing";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/dashboard"
          element={
            <AuthProtectedRoute>
              <Dashboard />
            </AuthProtectedRoute>
          }
        />
        <Route
          path="/image-editor"
          element={
            <AuthProtectedRoute>
              <ImageEditor />
            </AuthProtectedRoute>
          }
        />
        <Route
          path="/image-generator"
          element={
            <AuthProtectedRoute>
              <ImageGenerator />
            </AuthProtectedRoute>
          }
        />
        <Route
          path="/video-generator"
          element={
            <AuthProtectedRoute>
              <VideoGenerator />
            </AuthProtectedRoute>
          }
        />
        <Route
          path="/audio-chat"
          element={
            <AuthProtectedRoute>
              <AudioChat />
            </AuthProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
