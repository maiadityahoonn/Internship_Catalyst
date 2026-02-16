import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
  Brain,
  Target,
  Rocket,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Code2,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw,
  Zap,
  GraduationCap,
  TrendingUp,
  Star,
  BookOpen,
  Hammer,
  Clock,
  Shield,
} from "lucide-react";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { isToolPurchased, PRICING } from "../utils/aiMonetization";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import { analyzeSkillGap } from "../services/gemini";

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Mobile App Developer",
  "UI/UX Designer",
  "Cybersecurity Analyst",
  "Software Engineer",
  "Product Manager",
  "Blockchain Developer",
  "Game Developer",
];

const PRIORITY_CONFIG = {
  Critical: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: <AlertTriangle size={14} />,
  },
  Important: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: <Star size={14} />,
  },
  "Nice to Have": {
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    icon: <Lightbulb size={14} />,
  },
};

const DIFFICULTY_CONFIG = {
  Beginner: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  Intermediate: { color: "text-amber-400", bg: "bg-amber-500/10" },
  Advanced: { color: "text-rose-400", bg: "bg-rose-500/10" },
};

export default function SkillGapAnalyzer() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("gap");
  const [isLocked, setIsLocked] = useState(true);
  const resultRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.currentUser) {
        navigate("/auth");
        return;
      }
      setIsLocked(!isToolPurchased(auth.currentUser.uid, "skill-gap"));
    };
    checkAccess();
  }, [navigate]);

  const handleAnalyze = async () => {
    if (!currentSkills.trim()) {
      setError("Please enter your current skills.");
      return;
    }
    if (!targetRole) {
      setError("Please select a target role.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeSkillGap(currentSkills, targetRole);
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "from-emerald-500 to-green-400";
    if (score >= 50) return "from-amber-500 to-yellow-400";
    return "from-rose-500 to-red-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match!";
    if (score >= 60) return "Good Foundation";
    if (score >= 40) return "Needs Improvement";
    return "Significant Gap";
  };

  return (
    <MainLayout noContainer={true}>
      <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 selection:bg-purple-500/30 overflow-x-hidden font-sans pb-20 relative">
        {/* 🌌 BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-purple-500/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          {/* 🚀 HERO */}
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <FaShieldAlt className="animate-pulse" size={14} /> Career Trajectory Audit
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
            >
              Skill Gap <span className="text-purple-500">Analyzer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8 px-4"
            >
              Identify your technical blind spots and build a 100% match roadmap.
            </motion.p>
          </div>

          {/* PAYWALL OVERLAY */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-50 p-8 sm:p-12 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-center overflow-hidden mb-12"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/5 blur-3xl -z-10"></div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-lg shadow-amber-500/10">
                  <FaLock size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-3 uppercase tracking-tight text-white">Analysis Restricted</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  The Skill Gap Intelligence system is a premium protocol. Unlock full access to audit your career trajectory for <span className="text-white font-black">₹{PRICING['skill-gap']}</span>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/ai-hub')}
                    className="px-8 py-3.5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 w-full sm:w-auto"
                  >
                    Buy Access
                  </button>
                  <button
                    onClick={() => navigate('/ai-hub')}
                    className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all w-full sm:w-auto"
                  >
                    Back to Hub
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLocked && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {/* CURRENT SKILLS */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 group-hover:border-purple-500/30 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Code2 className="text-purple-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-white">
                          Your Current Skills
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Comma-separated list
                        </p>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      placeholder="e.g. HTML, CSS, JavaScript, React, Git, Figma"
                      className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 outline-none text-white text-sm font-medium placeholder:text-slate-600 resize-none transition-colors"
                    />

                    {/* Quick Add Chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["HTML", "CSS", "JavaScript", "Python", "React", "Node.js", "SQL", "Git"].map(
                        (skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              const skills = currentSkills
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              if (!skills.includes(skill)) {
                                setCurrentSkills(
                                  skills.length ? `${currentSkills}, ${skill}` : skill
                                );
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all uppercase tracking-wider"
                          >
                            + {skill}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* TARGET ROLE */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 group-hover:border-pink-500/30 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                        <Target className="text-pink-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-white">
                          Target Role
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Where you want to be
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TARGET_ROLES.map((role) => (
                        <button
                          key={role}
                          onClick={() => setTargetRole(role)}
                          className={`px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-200 border ${targetRole === role
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 text-white shadow-lg shadow-purple-500/10"
                            : "bg-white/[0.02] border-white/5 text-slate-500 hover:text-white hover:border-white/20"
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ERROR */}
              < AnimatePresence >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2"
                  >
                    <XCircle size={16} /> {error}
                  </motion.div>
                )
                }
              </AnimatePresence >

              {/* ANALYZE BUTTON */}
              < div className="text-center mb-16" >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      AI is Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze My Skill Gap
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div >

              {/* 🧠 LOADING ANIMATION */}
              < AnimatePresence >
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-20"
                  >
                    <div className="max-w-2xl mx-auto">
                      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-[2rem] p-8 sm:p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />

                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 flex items-center justify-center"
                        >
                          <Brain className="text-purple-400" size={28} />
                        </motion.div>

                        <h3 className="text-lg font-black mb-2 text-white">
                          Neural Analysis in Progress
                        </h3>
                        <p className="text-slate-500 text-xs font-medium mb-6">
                          Scanning job market data, comparing skill profiles, building your roadmap...
                        </p>

                        {/* Progress Steps */}
                        <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
                          {[
                            "Parsing your skill set...",
                            "Matching against industry benchmarks...",
                            "Generating personalized roadmap...",
                            "Finding project recommendations...",
                          ].map((step, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.8 }}
                              className="flex items-center gap-2 text-xs font-medium"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.8 + 0.4 }}
                              >
                                <CheckCircle2 size={14} className="text-purple-400" />
                              </motion.div>
                              <span className="text-slate-400">{step}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence >

              {/* 📊 RESULTS SECTION */}
              < AnimatePresence >
                {result && (
                  <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {/* SCORE HEADER */}
                    <div className="relative mb-10">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-[2.5rem] blur opacity-10" />
                      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* SCORE CIRCLE */}
                          <div className="relative w-36 h-36 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth="8"
                              />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="url(#scoreGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                animate={{
                                  strokeDashoffset:
                                    2 * Math.PI * 42 * (1 - (result.matchScore || 0) / 100),
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              />
                              <defs>
                                <linearGradient
                                  id="scoreGradient"
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="0%"
                                >
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl font-black text-white"
                              >
                                {result.matchScore}%
                              </motion.span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                Match
                              </span>
                            </div>
                          </div>

                          {/* SCORE DETAILS */}
                          <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                              {getScoreLabel(result.matchScore)}
                            </h2>
                            <p className="text-slate-400 text-sm font-medium mb-4 leading-relaxed max-w-lg">
                              {result.topRecommendation}
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-emerald-400 text-xs font-bold">
                                  ✓ {result.matchedSkills?.length || 0} Matched
                                </span>
                              </div>
                              <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <span className="text-rose-400 text-xs font-bold">
                                  ✗ {result.missingSkills?.length || 0} Missing
                                </span>
                              </div>
                              <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <span className="text-purple-400 text-xs font-bold">
                                  🚀 {result.projectIdeas?.length || 0} Projects
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* RE-ANALYZE */}
                          <button
                            onClick={() => {
                              setResult(null);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                          >
                            <RefreshCw size={14} /> New Analysis
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TAB NAVIGATION */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                      {[
                        { id: "gap", label: "Gap Analysis", icon: <Target size={14} /> },
                        { id: "roadmap", label: "Learning Roadmap", icon: <TrendingUp size={14} /> },
                        { id: "projects", label: "Project Ideas", icon: <Hammer size={14} /> },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                            : "bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white"
                            }`}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* TAB CONTENT */}
                    <AnimatePresence mode="wait">
                      {/* GAP ANALYSIS TAB */}
                      {activeTab === "gap" && (
                        <motion.div
                          key="gap"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                          {/* MATCHED SKILLS */}
                          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="text-emerald-400" size={18} />
                              </div>
                              <h3 className="text-sm font-black uppercase tracking-tight">
                                Matched Skills
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {(result.matchedSkills || []).map((skill, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    <span className="text-sm font-bold text-white">
                                      {skill.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider">
                                    {skill.level}
                                  </span>
                                </motion.div>
                              ))}
                              {(!result.matchedSkills || result.matchedSkills.length === 0) && (
                                <p className="text-slate-500 text-xs text-center py-8">
                                  No matched skills found.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* MISSING SKILLS */}
                          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <XCircle className="text-rose-400" size={18} />
                              </div>
                              <h3 className="text-sm font-black uppercase tracking-tight">
                                Missing Skills
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {(result.missingSkills || []).map((skill, i) => {
                                const config =
                                  PRIORITY_CONFIG[skill.priority] || PRIORITY_CONFIG["Important"];
                                return (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-3 rounded-xl ${config.bg} border ${config.border}`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-bold text-white flex items-center gap-2">
                                        {config.icon} {skill.name}
                                      </span>
                                      <span
                                        className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}
                                      >
                                        {skill.priority}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium pl-5">
                                      {skill.reason}
                                    </p>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ROADMAP TAB */}
                      {activeTab === "roadmap" && (
                        <motion.div
                          key="roadmap"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-transparent hidden sm:block" />

                            <div className="space-y-6">
                              {(result.roadmap || []).map((phase, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.2 }}
                                  className="relative flex gap-6 sm:pl-4"
                                >
                                  {/* Timeline Dot */}
                                  <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center text-[10px] font-black text-white z-10 mt-6">
                                    {i + 1}
                                  </div>

                                  {/* Content Card */}
                                  <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 hover:border-purple-500/20 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="flex sm:hidden shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center text-[10px] font-black text-white">
                                        {i + 1}
                                      </div>
                                      <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                                          <Clock size={10} /> {phase.week}
                                        </span>
                                      </div>
                                    </div>

                                    <h4 className="text-base font-black mb-3 text-white tracking-tight">
                                      {phase.title}
                                    </h4>

                                    <div className="space-y-2 mb-4">
                                      {(phase.tasks || []).map((task, j) => (
                                        <div
                                          key={j}
                                          className="flex items-start gap-2 text-sm text-slate-400"
                                        >
                                          <ChevronRight
                                            size={14}
                                            className="text-purple-400 shrink-0 mt-0.5"
                                          />
                                          <span className="font-medium">{task}</span>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                                      <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                                        <Shield size={10} className="text-emerald-400" />
                                        <span className="text-emerald-400">Goal:</span>{" "}
                                        {phase.goal}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* PROJECTS TAB */}
                      {activeTab === "projects" && (
                        <motion.div
                          key="projects"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                          {(result.projectIdeas || []).map((project, i) => {
                            const diffConfig =
                              DIFFICULTY_CONFIG[project.difficulty] || DIFFICULTY_CONFIG["Intermediate"];
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="relative group"
                              >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-500" />
                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 group-hover:border-purple-500/20 rounded-[2rem] p-6 sm:p-8 h-full flex flex-col transition-all duration-300">
                                  {/* Difficulty badge */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                      <Hammer className="text-purple-400" size={20} />
                                    </div>
                                    <span
                                      className={`px-3 py-1 rounded-lg ${diffConfig.bg} text-[10px] font-bold uppercase tracking-wider ${diffConfig.color}`}
                                    >
                                      {project.difficulty}
                                    </span>
                                  </div>

                                  <h4 className="text-base font-black mb-2 text-white tracking-tight group-hover:text-purple-400 transition-colors">
                                    {project.title}
                                  </h4>

                                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4 flex-1">
                                    {project.description}
                                  </p>

                                  <div className="flex flex-wrap gap-1.5">
                                    {(project.skillsCovered || []).map((skill, j) => (
                                      <span
                                        key={j}
                                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-wider"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence >

              {/* NO API KEY INFO */}
              {
                !result && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          icon: <Brain className="text-purple-400" size={22} />,
                          title: "AI-Powered",
                          desc: "Uses advanced AI to analyze your profile against real market data.",
                        },
                        {
                          icon: <Hammer className="text-pink-400" size={22} />,
                          title: "Project Ideas",
                          desc: "Get specific project recommendations to fill your skill gaps.",
                        },
                        {
                          icon: <TrendingUp className="text-emerald-400" size={22} />,
                          title: "Roadmap",
                          desc: "A personalized week-by-week learning plan to reach your goal.",
                        },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                            {feature.icon}
                          </div>
                          <h4 className="text-xs font-black uppercase tracking-tight mb-1 text-white">
                            {feature.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              }
            </>
          )
          }
        </div >

        <div className="h-20" />
      </div >
    </MainLayout >
  );
}
