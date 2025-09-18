import { useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { initTranslation, translatePage } from "@/lib/translation";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import InProgress from "./pages/InProgress";
import Navigation from "@/components/Navigation";
import Home from "./pages/Home";
import Vitals from "./pages/Vitals";
import MentalHealthOverview from "./pages/MentalHealthOverview";
import Mindfulbot from "./pages/mindfulbot";
import ExerciseandWellness from "./pages/exercise";
import HealthOverview from "./pages/HealthOverview";
import Inprogress from "./pages/InProgress";
import MentalHealthResources from "./pages/resources";
import Medbot from "./pages/medbot";
import Medication from "./pages/medication";
import QuestionsPage from "./pages/QuestionsPage";
import JournalPage from "./pages/journal";
import MoodTracker from "./pages/MoodTracker";
import Depression from "./pages/Depression";
import Anxiety from "./pages/Anxiety";
import Bipolar from "./pages/Bipolar";
import Stress from "./pages/Stress";
import PTSD from "./pages/PTSD";
import Panic from "./pages/Panic";
import LoginPage from "./pages/loginpage"

const queryClient = new QueryClient();

// Layout wrapper with Navigation + Outlet
const AppLayout = () => (
  <>
    <Navigation />
    <Outlet />
  </>
);

const AppContent = () => {
  const location = useLocation();

  // Keep everything translated as the app runs
  useEffect(() => {
    const obs = initTranslation();
    return () => { try { obs?.disconnect(); } catch {} };
  }, []);

  // Re-translate on route change
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    if (lang !== "en") translatePage(lang).catch(console.error);
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/MentalHealthOverview" element={<MentalHealthOverview />} />
        <Route path="/mindfulbot" element={<Mindfulbot />} />
        <Route path="/exercise" element={<ExerciseandWellness />} />
        <Route path="/HealthOverview" element={<HealthOverview />} />
        <Route path="/InProgress" element={<Inprogress />} />
        <Route path="/resources" element={<MentalHealthResources />} />
        <Route path="/medbot" element={<Medbot />} />
        <Route path="/medication" element={<Medication />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/moodtracker" element={<MoodTracker />} />
        <Route path="/depression" element={<Depression />} />
        <Route path="/anxiety" element={<Anxiety />} />
        <Route path="/stress" element={<Stress />} />
        <Route path="/panic" element={<Panic />} />
        <Route path="/ptsd" element={<PTSD />} />
        <Route path="/bipolar" element={<Bipolar />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 404 fallback */}
        <Route path="*" element={<InProgress />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
