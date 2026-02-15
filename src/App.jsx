import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./Pages/Home.jsx";
import Jobs from "./Pages/Jobs.jsx";
import Internships from "./Pages/Internships.jsx";
import Events from "./Pages/Events.jsx";
import Courses from "./Pages/Courses.jsx";
import Auth from "./Pages/Auth.jsx";
import "./index.css";

import AICVBuilder from "./Pages/AICVBuilder";
import ATSScoreChecker from "./Pages/ATSScoreChecker";
import SkillGapAnalyzer from "./Pages/SkillGapAnalyzer";
import AICoverLetter from "./Pages/AICoverLetter";
import AIResumeTemplates from "./Pages/AIResumeTemplates";
import AdminDashboard from "./Pages/AdminDashboard";
import AddEvent from "./Pages/AddEvent";
import EventDetails from "./Pages/EventDetails";


function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/auth";
  return (
    <>
      {!hideLayout && <Navbar siteTitle="Internship Catalyst" />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  const defaultConfig = {
    hero_title: "Your Career Journey Starts Here",
    hero_subtitle: "Discover amazing opportunities in internships, jobs, and events tailored for BTech, Bcom, DSA, MTECH, BSc, and MBA students",
    cta_button: "Get Started"
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Home defaultConfig={defaultConfig} />} />
          <Route path="/ai-cv-builder" element={<AICVBuilder />} />
          <Route path="/ai-resume-templates" element={<AIResumeTemplates />} />
          <Route path="/ats-score-checker" element={<ATSScoreChecker />} />
          <Route path="/skill-gap-analyzer" element={<SkillGapAnalyzer />} />
          <Route path="/cover-letter-ai" element={<AICoverLetter />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/event/add" element={<AddEvent />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;