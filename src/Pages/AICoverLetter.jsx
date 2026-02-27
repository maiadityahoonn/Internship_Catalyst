import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPenNib,
  FaMagic,
  FaCopy,
  FaCheckCircle,
  FaFileAlt,
  FaBriefcase,
  FaUserTie,
  FaLightbulb,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaTrash,
  FaLock
} from "react-icons/fa";
import { Loader2, ArrowRight, RefreshCw, Sparkles, ChevronRight, Info, Layers } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { generateCoverLetter } from "../services/gemini";
import { auth } from "../firebase";
import { isToolPurchased, recordPurchase, PRICING } from "../utils/aiMonetization";
import { useNavigate } from "react-router-dom";

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

export default function AICoverLetter() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    experience: "",
    jd: "",
  });
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("result");

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
    const purchased = await isToolPurchased(auth.currentUser.uid, "cover-letter");
    setIsLocked(!purchased);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.company || !formData.role) {
      setError("Please fill in Name, Company, and Role.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await generateCoverLetter({ ...formData, tone });
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      setError(err.message || "Failed to generate cover letter. Please try again.");
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
      amount: PRICING['cover-letter'].sale * 100,
      currency: "INR",
      name: "Internship Catalyst",
      description: "3 Month Access to AI Cover Letter",
      image: "https://internshipcatalyst.com/logo-og.png",
      handler: async (response) => {
        const success = await recordPurchase(
          auth.currentUser.uid,
          'cover-letter',
          response.razorpay_payment_id
        );

        if (success) {
          alert("AI Cover Letter Unlocked Successfully!");
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
        color: "#10b981"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCopy = () => {
    if (result?.letter) {
      navigator.clipboard.writeText(result.letter);
      alert("Cover letter copied to clipboard!");
    }
  };

  const inputClasses =
    "w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-white placeholder:text-slate-600 transition-all duration-300 text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 tracking-[0.2em]";

  const tones = [
    { id: "Professional", icon: <FaUserTie size={12} />, desc: "Balanced & Confident" },
    { id: "Passionate", icon: <FaRocket size={12} />, desc: "Mission-Driven" },
    { id: "Analytical", icon: <FaChartLine size={12} />, desc: "Data & Logic Focused" },
    { id: "Bold", icon: <Sparkles size={12} />, desc: "Unconventional & Peak Confidence" },
  ];

  return (
    <MainLayout noContainer={true}>
      <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-12 selection:bg-emerald-500/30 overflow-x-hidden font-sans relative">
        {/* 🌌 BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-emerald-500/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-teal-500/5 blur-[150px] rounded-full" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest mb-6 backdrop-blur-md"
            >
              <FaShieldAlt className="animate-pulse" /> AI Writing Helper
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                AI Cover{" "}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500">
                Letter
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-8"
            >
              Mirror the JD, showcase your narrative, and land the interview.
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-3xl -z-10"></div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-lg shadow-amber-500/10">
                  <FaLock size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-3 tracking-tight text-white">Access Denied</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  The AI Cover Letter system is a premium tool. Unlock full access to write your letter for just <span className="text-white font-black">₹{PRICING['cover-letter'].sale}</span>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handlePayment}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black tracking-widest text-[10px] hover:shadow-xl hover:shadow-emerald-500/20 transition-all w-full sm:w-auto"
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 🛠️ INPUT CONFIGURATION (COL-5) */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="lg:col-span-12 xl:col-span-5 space-y-6"
              >
                <motion.div variants={fadeInUp} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <FaBriefcase className="text-emerald-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black tracking-tight text-white">
                          Enter Job Details
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium">Add company and role info</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. John Wick"
                          className={inputClasses}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClasses}>Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="e.g. Continental Corp"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClasses}>Target Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Solutions Architect"
                        className={inputClasses}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className={labelClasses}>Job Description (JD)</label>
                        <span className="text-[9px] text-emerald-500 font-bold tracking-widest">
                          Highly Recommended
                        </span>
                      </div>
                      <textarea
                        name="jd"
                        rows={5}
                        value={formData.jd}
                        onChange={handleInputChange}
                        placeholder="Paste the job requirements here for maximum matching accuracy..."
                        className={inputClasses + " resize-none"}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClasses}>Your Key Achievements</label>
                      <textarea
                        name="experience"
                        rows={4}
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="What makes you special for this role? Mention 2-3 big wins..."
                        className={inputClasses + " resize-none"}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className={labelClasses}>Strategic Tone</label>
                      <div className="grid grid-cols-2 gap-2">
                        {tones.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTone(t.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${tone === t.id
                              ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                              : "bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                              }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg ${tone === t.id ? "bg-emerald-500 text-white" : "bg-white/5"
                                }`}
                            >
                              {t.icon}
                            </div>
                            <div>
                              <div className="text-[11px] font-black tracking-tight leading-none mb-1">
                                {t.id}
                              </div>
                              <div className="text-[9px] font-medium opacity-60 leading-none">
                                {t.desc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                        {error}
                      </motion.div>
                    )}

                    <motion.button
                      variants={fadeInUp}
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Generating Draft...
                        </>
                      ) : (
                        <>
                          <FaMagic /> Initialize Generation
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              {/* 📄 RESULT AREA (COL-7) */}
              <div className="lg:col-span-12 xl:col-span-7">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      ref={resultRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6"
                    >
                      {/* THE LETTER CARD */}
                      <motion.div variants={fadeInUp} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
                        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                          <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="text-base md:text-lg font-black tracking-tight text-emerald-400 flex items-center gap-2">
                              <FaFileAlt /> Generated Draft
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCopy}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all flex items-center gap-2"
                              >
                                <FaCopy /> Copy
                              </button>
                              <button
                                onClick={() => setResult(null)}
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all flex items-center justify-center"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="p-8 sm:p-12 min-h-[500px]">
                            <div className="prose prose-invert max-w-none">
                              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-serif italic selection:bg-emerald-500/40">
                                {result.letter}
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-emerald-500/5 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 tracking-widest">
                              <FaCheckCircle /> AI-Optimized Text
                            </div>
                            <span className="text-[9px] text-slate-500 font-medium">
                              {result.letter.split(" ").length} Words
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* COMPETITIVE ANALYSIS CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WHY THIS WORKS */}
                        <motion.div variants={fadeInUp} className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <FaShieldAlt className="text-sky-400" size={16} />
                            <h4 className="text-[11px] font-black tracking-widest text-white">
                              Competitive Edge
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">
                            {result.competitiveEdge}
                          </p>
                          <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                            <p className="text-[9px] font-black text-sky-400 tracking-widest flex items-center gap-2">
                              <Sparkles size={12} /> Optimization Level: 98%
                            </p>
                          </div>
                        </motion.div>

                        {/* JD MATCHES */}
                        <motion.div variants={fadeInUp} className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <FaLightbulb className="text-amber-400" size={16} />
                            <h4 className="text-[11px] font-black tracking-widest text-white">
                              Strategic Mirrors
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {result.analysis?.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-2"
                              >
                                <ChevronRight className="shrink-0 text-emerald-400 mt-0.5" size={12} />
                                <div>
                                  <div className="text-[10px] font-bold text-white mb-0.5 leading-tight">
                                    {item.point}
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-tight">
                                    {item.how}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : loading ? (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-32 h-32 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 relative"
                      >
                        <FaMagic className="text-emerald-400" size={40} />
                        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping-slow" />
                      </motion.div>
                      <h3 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter">
                        Writing Draft...
                      </h3>
                      <p className="text-slate-500 text-xs font-medium max-w-[250px] text-center leading-relaxed">
                        Reading the job details and writing your story.
                      </p>
                    </div>
                  ) : (
                    <motion.div variants={fadeInUp} className="h-full bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 mb-6">
                        <FaMagic size={32} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black mb-2 text-white/50 tracking-tight">
                        System Idle
                      </h3>
                      <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                        Fill in the details on the left to start writing your cover letter.
                      </p>
                      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 scale-90 opacity-40">
                          <div className="h-2 w-12 bg-slate-700 rounded mb-2" />
                          <div className="h-1.5 w-full bg-slate-800 rounded" />
                          <div className="h-1.5 w-full bg-slate-800 rounded mt-1" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 scale-90 opacity-40">
                          <div className="h-2 w-12 bg-slate-700 rounded mb-2" />
                          <div className="h-1.5 w-full bg-slate-800 rounded" />
                          <div className="h-1.5 w-full bg-slate-800 rounded mt-1" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 🌟 PRO TIPS SECTION */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="mt-20 pt-20 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div variants={fadeInUp} className="flex-1">
                <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                  Beyond Job-Winning. <br />
                  <span className="text-emerald-500">Career-Defining.</span>
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg mb-8">
                  Generic cover letters are a thing of the past. Our AI doesn't just fill templates;
                  it reverse-engineers what hiring managers are actually looking for in a top-tier
                  candidate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Matches Job Details",
                    "Simple & Clean Text",
                    "Story-Based Writing",
                    "Goal-Focused",
                  ].map((feature, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex items-center gap-2 text-[10px] font-black text-white/80 tracking-widest">
                      <FaCheckCircle className="text-emerald-500" size={12} /> {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex-1 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-3xl font-black text-white mb-1">92%</div>
                  <div className="text-[10px] font-black text-emerald-500 tracking-widest">
                    Interview Rate Increase
                  </div>
                </div>
                <div className="p-6 rounded-[2.5rem] bg-sky-500/5 border border-sky-500/10">
                  <div className="text-3xl font-black text-white mb-1">10s</div>
                  <div className="text-[10px] font-black text-sky-400 tracking-widest">
                    Average Generation Time
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          {/* 📘 EDUCATIONAL CONTENT SECTION */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="mt-24 space-y-16"
          >
            {/* 1. Writing Tips */}
            <motion.section variants={fadeInUp} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[3rem] blur opacity-50" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                      <FaPenNib size={28} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tight uppercase">Writing <br /> Tips</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      A good cover letter shows why you are a great fit. Follow these simple steps.
                    </p>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: "The Hook", desc: "Start with why you love THIS company, not just any company.", icon: <Sparkles size={18} /> },
                      { title: "The Proof", desc: "Don't just say you're good; cite a specific project or metric.", icon: <FaCheckCircle size={18} /> },
                      { title: "The Bridge", desc: "Explain how your past experience solves their current problems.", icon: <Info size={18} /> },
                      { title: "The Ask", desc: "End with a clear, confident call to action for an interview.", icon: <ArrowRight size={18} /> }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group/item">
                        <div className="text-emerald-500 mb-4 group-hover/item:scale-110 transition-transform">{item.icon}</div>
                        <h4 className="text-sm font-black mb-2 text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 2. Choosing the Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp} className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                  <FaUserTie className="text-emerald-400" />
                  When to use Professional?
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Best for banks and large companies. It sounds formal and respectful.
                </p>
                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 italic text-[10px] text-slate-500">
                  "I am writing to express my interest in the analyst position at Fortune 500 Corp, bringing 3 years of experience..."
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="p-8 rounded-[2.5rem] bg-teal-500/5 border border-teal-500/10">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                  <FaRocket className="text-teal-400" />
                  When to use Passionate?
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Best for startups and creative teams. It shows you care about the mission.
                </p>
                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 italic text-[10px] text-slate-500">
                  "I've been following your work since day one, and I'm ready to bring my energy to your team..."
                </div>
              </motion.div>
            </div>

            {/* 3. How the letter is built */}
            <motion.section variants={fadeInUp} className="p-8 md:p-12 rounded-[3rem] bg-slate-900/50 border border-white/5 text-center">
              <h3 className="text-xs font-black text-emerald-500 tracking-[0.4em] uppercase mb-12">How the letter is built</h3>
              <div className="max-w-xl mx-auto space-y-2">
                <div className="w-full py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">The Header & Salutation</div>
                <div className="w-[90%] mx-auto py-6 bg-white/5 border border-white/10 rounded-lg text-[9px] font-medium text-slate-500">The "Hook" - Why you specifically care about their company.</div>
                <div className="w-full py-12 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] font-black text-white px-8 flex items-center justify-center">The "Meat" - 2 specific achievements that match the job details.</div>
                <div className="w-[85%] mx-auto py-6 bg-white/5 border border-white/10 rounded-lg text-[9px] font-medium text-slate-500">The "Impact" - What you will do on Day 1 if hired.</div>
                <div className="w-[70%] ml-0 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">The Closing & Signature</div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
