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
  Globe,
} from "lucide-react";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { isToolPurchased, recordPurchase, PRICING } from "../utils/aiMonetization";
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
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
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    checkAccess();
  }, [navigate]);

  const checkAccess = async () => {
    if (!auth.currentUser) {
      navigate("/auth");
      return;
    }
    const owned = await isToolPurchased(auth.currentUser.uid, "skill-gap");
    setIsLocked(!owned);
  };

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

  const handlePayment = async () => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: PRICING['skill-gap'].sale * 100,
      currency: "INR",
      name: "Internship Catalyst",
      description: "3 Month Access to Skill Gap Analyzer",
      image: "https://internshipcatalyst.com/logo-og.png",
      handler: async (response) => {
        const success = await recordPurchase(
          auth.currentUser.uid,
          'skill-gap',
          response.razorpay_payment_id
        );

        if (success) {
          alert("Skill Gap Analyzer Unlocked Successfully!");
          setIsLocked(false);
        } else {
          alert("Something went wrong. Please contact support.");
        }
      },
      prefill: {
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || ""
      },
      theme: {
        color: "#a855f7"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          {/* 🚀 HERO */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="text-center mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest mb-6 backdrop-blur-md"
            >
              <FaShieldAlt className="animate-pulse" size={14} /> Job Skills Check
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Skills Gap </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">Checker</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-8 px-4"
            >
              Find out what you need to learn to get your dream job.
            </motion.p>
          </motion.div>

          {/* PAYWALL OVERLAY */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-50 p-8 sm:p-12 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-center overflow-hidden mb-12"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/5 blur-3xl -z-10"></div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-lg shadow-amber-500/10">
                  <FaLock size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-3 tracking-tight text-white">Access Denied</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  The Skills Gap Checker is a premium tool. Unlock full access to see your career growth for <span className="text-white font-black">₹{PRICING['skill-gap'].sale}</span>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handlePayment}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black tracking-widest text-[10px] hover:shadow-xl hover:shadow-purple-500/20 transition-all w-full sm:w-auto"
                  >
                    Unlock Now
                  </button>
                  <button
                    onClick={() => navigate('/ai')}
                    className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-black tracking-widest text-[10px] hover:bg-white/10 transition-all w-full sm:w-auto"
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
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {/* CURRENT SKILLS */}
                <motion.div variants={fadeInUp} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 group-hover:border-purple-500/30 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Code2 className="text-purple-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black tracking-tight text-white">
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
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all tracking-wider"
                          >
                            + {skill}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* TARGET ROLE */}
                <motion.div variants={fadeInUp} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 group-hover:border-pink-500/30 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                        <Target className="text-pink-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black tracking-tight text-white">
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
                </motion.div>
              </motion.div>

              {/* ERROR */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2"
                  >
                    <XCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ANALYZE BUTTON */}
              <div className="text-center mb-16">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black tracking-widest text-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>

              {/* 🧠 LOADING ANIMATION */}
              <AnimatePresence>
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

                        <h3 className="text-xl md:text-2xl font-black mb-2 text-white tracking-tight">
                          Neural Analysis in Progress
                        </h3>
                        <p className="text-slate-500 text-xs font-medium mb-6">
                          Checking your skills and finding what you need to learn...
                        </p>

                        {/* Progress Steps */}
                        <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
                          {[
                            "Checking your skills...",
                            "Matching with job requirements...",
                            "Building your learning plan...",
                            "Finding project ideas...",
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
              </AnimatePresence>

              {/* 📊 RESULTS SECTION */}
              <AnimatePresence>
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
                              <span className="text-[9px] font-bold text-slate-500 tracking-widest">
                                Match
                              </span>
                            </div>
                          </div>

                          {/* SCORE DETAILS */}
                          <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-2 tracking-tight">
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
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${activeTab === tab.id
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
                          <motion.div variants={fadeInUp} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="text-emerald-400" size={18} />
                              </div>
                              <h3 className="text-base md:text-lg font-black tracking-tight">
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
                                  <span className="text-[10px] font-bold text-emerald-400/70 tracking-wider">
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
                          </motion.div>

                          {/* MISSING SKILLS */}
                          <motion.div variants={fadeInUp} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <XCircle className="text-rose-400" size={18} />
                              </div>
                              <h3 className="text-base md:text-lg font-black tracking-tight">
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
                                        className={`text-[10px] font-bold tracking-wider ${config.color}`}
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
                          </motion.div>
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
                                  <motion.div variants={fadeInUp} className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 hover:border-purple-500/20 rounded-[2rem] p-6 sm:p-8 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="flex sm:hidden shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center text-[10px] font-black text-white">
                                        {i + 1}
                                      </div>
                                      <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <span className="text-[10px] font-bold text-purple-400 tracking-wider flex items-center gap-1">
                                          <Clock size={10} /> {phase.week}
                                        </span>
                                      </div>
                                    </div>

                                    <h4 className="text-base md:text-lg font-black mb-3 text-white tracking-tight">
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
                                  </motion.div>
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
                                variants={fadeInUp}
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
                                      className={`px-3 py-1 rounded-lg ${diffConfig.bg} text-[10px] font-bold tracking-wider ${diffConfig.color}`}
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
                                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 tracking-wider"
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
              </AnimatePresence>

              {/* NO API KEY INFO */}
              {
                !result && !loading && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
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
                        <motion.div
                          key={i}
                          variants={fadeInUp}
                          className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                            {feature.icon}
                          </div>
                          <h4 className="text-xs font-black tracking-tight mb-1 text-white">
                            {feature.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">{feature.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              }
            </>
          )}
          {/* 📘 EDUCATIONAL CONTENT SECTION */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="mt-24 space-y-16"
          >
            {/* 1. Job Growth Info */}
            <motion.section variants={fadeInUp} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[3rem] blur opacity-50" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                      <TrendingUp size={28} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tight uppercase">Job <br /> Growth Info</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Understanding the long-term potential of your chosen role is as important as learning the skills.
                    </p>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: "Future Proof", desc: "How likely is this role to stay important with AI and other changes?", icon: <Shield size={18} /> },
                      { title: "Earning Potential", desc: "How much can you earn as you get more experience?", icon: <Zap size={18} /> },
                      { title: "Changing Roles", desc: "Can you easily move to other jobs or departments later?", icon: <Layers size={18} /> },
                      { title: "Global Demand", desc: "How popular are these skills in other countries?", icon: <Globe size={18} /> }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all group/item">
                        <div className="text-purple-500 mb-4 group-hover/item:scale-110 transition-transform">{item.icon}</div>
                        <h4 className="text-sm font-black mb-2 text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 2. Top Skills for 2026 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "AI Basics", desc: "Understanding AI tools is now a basic requirement for most jobs.", icon: <Brain size={20} />, color: "text-sky-400", bg: "bg-sky-500/5" },
                { title: "Special Skills", desc: "Expertise in one specific area is more valuable than being a generalist.", icon: <Target size={20} />, color: "text-pink-400", bg: "bg-pink-500/5" },
                { title: "Teamwork", desc: "Clear communication and teamwork are the most important soft skills.", icon: <Sparkles size={20} />, color: "text-amber-400", bg: "bg-amber-500/5" }
              ].map((trend, i) => (
                <motion.div key={i} variants={fadeInUp} className={`p-8 rounded-[2.5rem] border border-white/5 ${trend.bg}`}>
                  <div className={`${trend.color} mb-6`}>{trend.icon}</div>
                  <h3 className="text-lg font-black mb-3">{trend.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{trend.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* 3. Success Roadmap Guide */}
            <motion.section variants={fadeInUp} className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-white/5 text-center">
              <h3 className="text-2xl font-black mb-8 tracking-tight">How to use your Roadmap?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-purple-400 tracking-widest uppercase">The 80/20 Rule</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">Focus on the 'Critical' skills first. They will give you 80% of the results.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-pink-400 tracking-widest uppercase">Quick Learning</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">Build small projects as you learn. Don't just watch videos—write code!</p>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
