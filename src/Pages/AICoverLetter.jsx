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
import { Loader2, ArrowRight, RefreshCw, Sparkles, ChevronRight, Info } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { generateCoverLetter } from "../services/gemini";
import { auth } from "../firebase";
import { isToolPurchased, PRICING } from "../utils/aiMonetization";
import { useNavigate } from "react-router-dom";

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
    const checkAccess = async () => {
      if (!auth.currentUser) {
        navigate("/auth");
        return;
      }
      const purchased = await isToolPurchased(auth.currentUser.uid, "cover-letter");
      setIsLocked(!purchased);
    };
    checkAccess();
  }, [navigate]);

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

  const handleCopy = () => {
    if (result?.letter) {
      navigator.clipboard.writeText(result.letter);
      alert("Cover letter copied to clipboard!");
    }
  };

  const inputClasses =
    "w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-white placeholder:text-slate-600 transition-all duration-300 text-sm";
  const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]";

  const tones = [
    { id: "Professional", icon: <FaUserTie size={12} />, desc: "Balanced & Confident" },
    { id: "Passionate", icon: <FaRocket size={12} />, desc: "Mission-Driven" },
    { id: "Analytical", icon: <FaChartLine size={12} />, desc: "Data & Logic Focused" },
    { id: "Bold", icon: <Sparkles size={12} />, desc: "Unconventional & Peak Confidence" },
  ];

  return (
    <MainLayout noContainer={true}>
      <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 overflow-x-hidden font-sans pb-20 relative">
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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* 🚀 HERO */}
          <div className="text-center pt-24 md:pt-32 mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <FaShieldAlt className="animate-pulse" /> Precision Narrative Protocol
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[2.25rem] sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                AI Cover{" "}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500">
                Letter
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8 px-4"
            >
              Mirror the JD, showcase your narrative, and land the interview.
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-3xl -z-10"></div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-lg shadow-amber-500/10">
                  <FaLock size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-3 uppercase tracking-tight text-white">Deployment Restricted</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  The AI Cover Letter system is a premium deployment. Unlock full access to craft elite narratives for <span className="text-white font-black">₹{PRICING['cover-letter'].sale}</span>.
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 🛠️ INPUT CONFIGURATION (COL-5) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 space-y-6"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <FaBriefcase className="text-emerald-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-white">
                          Mission Parameters
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium">Define your target</p>
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
                        <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
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
                              <div className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">
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
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 📄 RESULT AREA (COL-7) */}
              <div className="lg:col-span-7">
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
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
                        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                          <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                              <FaFileAlt /> Generated Draft
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCopy}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all flex items-center gap-2"
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
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                              <FaCheckCircle /> AI-Optimized Text
                            </div>
                            <span className="text-[9px] text-slate-500 font-medium">
                              {result.letter.split(" ").length} Words
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* COMPETITIVE ANALYSIS CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WHY THIS WORKS */}
                        <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <FaShieldAlt className="text-sky-400" size={16} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                              Competitive Edge
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">
                            {result.competitiveEdge}
                          </p>
                          <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                            <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                              <Sparkles size={12} /> Optimization Level: 98%
                            </p>
                          </div>
                        </div>

                        {/* JD MATCHES */}
                        <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <FaLightbulb className="text-amber-400" size={16} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                              Strategic Mirrors
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {result.analysis?.map((item, i) => (
                              <div key={i} className="flex gap-2">
                                <ChevronRight className="shrink-0 text-emerald-400 mt-0.5" size={12} />
                                <div>
                                  <div className="text-[10px] font-bold text-white uppercase mb-0.5 leading-tight">
                                    {item.point}
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-tight">
                                    {item.how}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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
                      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">
                        Neural Drafting...
                      </h3>
                      <p className="text-slate-500 text-xs font-medium max-w-[250px] text-center leading-relaxed">
                        Analyzing job requirements, matching skill overlaps, and crafting your narrative.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 mb-6">
                        <FaMagic size={32} />
                      </div>
                      <h3 className="text-lg font-black mb-2 text-white/50 uppercase tracking-tight">
                        System Idle
                      </h3>
                      <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                        Enter your mission parameters on the left to initialize the cover letter
                        generation protocol.
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
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 🌟 PRO TIPS SECTION */}
          <div className="mt-20 pt-20 border-t border-white/5">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">
                  Beyond Job-Winning. <br />
                  <span className="text-emerald-500">Career-Defining.</span>
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-lg mb-8">
                  Generic cover letters are a thing of the past. Our AI doesn't just fill templates;
                  it reverse-engineers what hiring managers are actually looking for in a top-tier
                  candidate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "JD-Mirroring Technology",
                    "ATS-Friendly Metadata",
                    "Story-First Composition",
                    "Pain-Point Addressing",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/80 tracking-widest">
                      <FaCheckCircle className="text-emerald-500" size={12} /> {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-3xl font-black text-white mb-1">92%</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Interview Rate Increase
                  </div>
                </div>
                <div className="p-6 rounded-[2.5rem] bg-sky-500/5 border border-sky-500/10">
                  <div className="text-3xl font-black text-white mb-1">10s</div>
                  <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
                    Average Generation Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-32"></div>
      </div>
    </MainLayout>
  );
}
