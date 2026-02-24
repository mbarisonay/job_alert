import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { JobSearchPage } from "@/pages/JobSearchPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RecommendedPage } from "@/pages/dashboard/RecommendedPage";
import { CvAnalysisPage } from "@/pages/dashboard/CvAnalysisPage";
import { SavedJobsPage } from "@/pages/dashboard/SavedJobsPage";
import { TrackingPage } from "@/pages/dashboard/TrackingPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { useThemeInit } from "@/store/themeStore";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";

function App() {
  useThemeInit();

  return (
    <>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecommendedPage />} />
          <Route path="cv" element={<CvAnalysisPage />} />
          <Route path="saved" element={<SavedJobsPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
