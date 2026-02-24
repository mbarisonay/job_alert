import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { JobSearchPage } from "@/pages/JobSearchPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useThemeInit } from "@/store/themeStore";
import "./index.css";

function App() {
  useThemeInit();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobSearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
