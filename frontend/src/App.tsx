import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LandingPage } from "@/pages/landing";
import { Dashboard } from "@/pages/dashboard";
import { ImageEditor } from "@/pages/image-editor";
import { VideoGenerator } from "@/pages/video-generator";
import { AudioChat } from "@/pages/audio-chat";
import { TextToImage } from "@/pages/text-to-image";
import { Pricing } from "@/pages/pricing";
import { TestPage } from "./pages/test";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/image-editor"
          element={
            <ProtectedRoute>
              <ImageEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/text-to-image"
          element={
            <ProtectedRoute>
              <TextToImage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-generator"
          element={
            <ProtectedRoute>
              <VideoGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audio-chat"
          element={
            <ProtectedRoute>
              <AudioChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
