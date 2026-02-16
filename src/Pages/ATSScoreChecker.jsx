import React, { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaSearch,
  FaChartPie,
  FaLightbulb,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaExclamationTriangle,
  FaHistory,
  FaWrench,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { Loader2, Sparkles, RefreshCw, ChevronRight, Info, Zap, Layout, Terminal } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { analyzeATS } from "../services/gemini";
import { auth } from "../firebase";
import { isToolPurchased, PRICING } from "../utils/aiMonetization";
import { useNavigate } from "react-router-dom";

// Initialize worker using static file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function ATSScoreChecker() {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isTagsProcessing, setIsTagsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.currentUser) {
        navigate('/auth');
        return;
      }
      const owned = await isToolPurchased(auth.currentUser.uid, 'ats-checker');
      setIsLocked(!owned);
    };
    checkAccess();
  }, [navigate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setResumeText("");
    setProcessingError("");
    setIsTagsProcessing(true);

    try {
      const text = await extractText(file);
      if (text && text.trim().length > 15) {
        setResumeText(text);
        setProcessingError("");
      } else {
        setProcessingError("Text extraction yielded too little content. Please try a different file.");
      }
    } catch (err) {
      setProcessingError("Failed to process file: " + err.message);
    } finally {
      setIsTagsProcessing(false);
    }
  };

  const extractText = async (file) => {
    const fileType = file.type;
    try {
      if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        return text;
      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else {
        return await file.text();
      }
    } catch (err) {
      throw err;
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError("Please upload your resume first.");
      return;
    }
    if (!jobDescription) {
      setError("Please enter a Job Description for accurate matching.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const data = await analyzeATS(resumeText, jobDescription);
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 50) return "text-sky-400 border-sky-500/30 bg-sky-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <MainLayout noContainer={true}>
      <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans pb-24 relative">
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none -z-10 mt-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto mt-20 md:mt-24">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <FaShieldAlt className="animate-pulse" /> Neural ATS Defense
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              ATS Score <span className="text-sky-500">Intelligence</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
              Don't leave your career to chance. Our neural matching engine reverse-engineers recruiter algorithms with 95% accuracy.
            </p>
          </div>

          {/* PAYWALL OVERLAY */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-50 p-8 sm:p-12 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-center overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-500/5 blur-3xl -z-10"></div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-lg shadow-amber-500/10">
                  <FaLock size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-3 uppercase tracking-tight text-white">Protocol Restricted</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                  The ATS Score Intelligence system is an elite protocol. Unlock full access to audit your resume health for just <span className="text-white font-black">₹{PRICING['ats-checker'].sale}</span>.
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
              {/* 📥 INPUTS AREA (COL-5) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-12 xl:col-span-5 space-y-6"
              >
                {/* UPLOAD CARD */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                          <FaCloudUploadAlt className="text-sky-400" size={18} />
                        </div>
                        <div>
                          <h2 className="text-sm font-black uppercase tracking-tight text-white">
                            Resume Source
                          </h2>
                          <p className="text-[10px] text-slate-500 font-medium">PDF, DOCX, or TXT</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={handleBrowseClick}
                      className={`relative h-48 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${fileName
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-sky-500/40"
                        }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                      />

                      {isTagsProcessing ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin text-sky-400" size={32} />
                          <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                            Extracting Text...
                          </span>
                        </div>
                      ) : fileName ? (
                        <div className="flex flex-col items-center gap-2 text-center px-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                            <FaCheckCircle size={24} />
                          </div>
                          <span className="text-sm font-bold text-white truncate max-w-[200px]">
                            {fileName}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                            {resumeText.length} Characters Detected
                          </span>
                          <button className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 transition-colors">
                            Replace File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-sky-400 transition-colors">
                            <FaFileAlt size={24} />
                          </div>
                          <p className="text-xs font-bold text-slate-400">
                            Click to upload your resume
                          </p>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-none">
                            Max size 10MB
                          </p>
                        </div>
                      )}

                      {processingError && (
                        <div className="absolute inset-0 bg-rose-900/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                          <p className="text-[11px] font-bold text-white">{processingError}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProcessingError("");
                            }}
                            className="absolute top-2 right-2 text-white/50 hover:text-white"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* JD CARD */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <FaSearch className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-white">
                          Target Requirements
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium">Job Description</p>
                      </div>
                    </div>

                    <textarea
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the Job Description here. The more you paste, the more accurate the neural match becomes..."
                      className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none text-white placeholder:text-slate-700 transition-all duration-300 text-sm font-serif italic"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-3">
                    <FaExclamationTriangle shrink={0} /> {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || isTagsProcessing || !resumeText}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      System Analysis...
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Run Neural Audit
                    </>
                  )}
                </button>
              </motion.div>

              {/* 📊 RESULTS AREA (COL-7) */}
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
                      {/* SCORE & SUMMARY CARD */}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-10" />
                        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10">
                          <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* THE RADAR SCORE */}
                            <div className="relative w-40 h-40 shrink-0">
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
                                  stroke="url(#atsGradient)"
                                  strokeWidth="8"
                                  strokeLinecap="round"
                                  strokeDasharray={264}
                                  initial={{ strokeDashoffset: 264 }}
                                  animate={{
                                    strokeDashoffset: 264 * (1 - result.score / 100),
                                  }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                <defs>
                                  <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#0ea5e9" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="text-4xl font-black text-white"
                                >
                                  {result.score}%
                                </motion.span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                  ATS Match
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 mb-2">
                                System Intelligence Report
                              </h3>
                              <h2 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">
                                {result.score >= 80
                                  ? "Strong Pass"
                                  : result.score >= 50
                                    ? "Partial Match"
                                    : "Neural Gap Detected"}
                              </h2>
                              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                                {result.summary}
                              </p>
                              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                  <FaShieldAlt size={12} /> Format:{" "}
                                  {result.formattingAudit.isSafe ? "Safe" : "At Risk"}
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                  <Sparkles size={12} /> Impact: {result.impactScore}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TABS NAVIGATION */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          { id: "overview", label: "Semantic Audit", icon: <Layout size={14} /> },
                          { id: "fixes", label: "Boost My Score", icon: <FaRocket size={12} /> },
                          { id: "formatting", label: "Formatting Health", icon: <FaShieldAlt size={12} /> },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                              ? "bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-500/30 text-white"
                              : "bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white"
                              }`}
                          >
                            {tab.icon} {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* TAB CONTENT */}
                      <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                          <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          >
                            {/* Semantic Matches */}
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                                <FaCheckCircle /> Semantic Strengths
                              </h4>
                              <div className="space-y-4">
                                {result.semanticMatches.map((match, i) => (
                                  <div
                                    key={i}
                                    className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-white">
                                        {match.concept}
                                      </span>
                                      <span className="text-[9px] font-black text-emerald-500/70 uppercase">
                                        {match.relevance}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">
                                      {match.detail}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Keyword Gaps */}
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-8">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-400 mb-6 flex items-center gap-2">
                                <FaExclamationTriangle /> Critical Keywords Gap
                              </h4>
                              <div className="space-y-4">
                                {result.keywordGap.map((gap, i) => (
                                  <div
                                    key={i}
                                    className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10"
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-white">
                                        {gap.keyword}
                                      </span>
                                      <span className="text-[9px] font-black text-orange-500/70 uppercase">
                                        {gap.importance}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">
                                      {gap.fix}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === "fixes" && (
                          <motion.div
                            key="fixes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 mb-2">
                              <p className="text-xs text-indigo-300 font-medium leading-relaxed italic">
                                "The following suggestions are neural-optimized specifically for this JD to bypass parsing filters and impress human reviewers."
                              </p>
                            </div>
                            {result.boostMyScore.map((fix, i) => (
                              <div
                                key={i}
                                className="relative bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden group"
                              >
                                <div className="p-6 border-b border-white/5">
                                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <FaHistory /> Original text
                                  </div>
                                  <p className="text-xs text-slate-500 line-through italic px-2 border-l border-slate-700">
                                    {fix.original}
                                  </p>
                                </div>
                                <div className="p-6 bg-sky-500/5">
                                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-sky-400 mb-2">
                                    <FaRocket /> AI Recommendation
                                  </div>
                                  <p className="text-sm text-white font-bold mb-3">
                                    {fix.suggested}
                                  </p>
                                  <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium bg-black/20 p-3 rounded-xl border border-white/5">
                                    <FaLightbulb className="text-amber-400 shrink-0 mt-0.5" />
                                    <span>{fix.reason}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}

                        {activeTab === "formatting" && (
                          <motion.div
                            key="formatting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8">
                              <div className="flex flex-col md:flex-row items-center gap-10 mb-10 pb-10 border-b border-white/5">
                                <div className="h-32 w-32 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center p-4">
                                  <FaShieldAlt
                                    size={40}
                                    className={
                                      result.formattingAudit.isSafe ? "text-emerald-500" : "text-rose-500"
                                    }
                                  />
                                  <span className="text-[10px] font-black uppercase mt-2">
                                    Audit Integrity
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                      Parsing Compatibility
                                    </span>
                                    <span className="text-sm font-black text-white">
                                      {result.formattingAudit.score}%
                                    </span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${result.formattingAudit.score}%` }}
                                      className={`h-full ${result.formattingAudit.isSafe ? "bg-emerald-500" : "bg-rose-500"
                                        }`}
                                    />
                                  </div>
                                  <p className="mt-4 text-xs text-slate-400 font-medium">
                                    {result.formattingAudit.isSafe
                                      ? "Your resume's structural layout is optimized for major tracking systems (Workday, Greenhouse, etc.)."
                                      : "Warning: High risk of parsing failure detected. Simplify your layout to avoid automatic rejection."}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-4">
                                  Detected Structural Issues
                                </h5>
                                {result.formattingAudit.issues.map((issue, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                                      <FaExclamationTriangle size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">
                                      {issue}
                                    </span>
                                  </div>
                                ))}
                                {result.formattingAudit.issues.length === 0 && (
                                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <FaCheckCircle className="text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-400">
                                      Zero structural issues detected.
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* RE-ANALYZE BUTTON */}
                      <div className="pt-6 flex justify-center">
                        <button
                          onClick={() => {
                            setResult(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-sky-500/30 transition-all flex items-center gap-2"
                        >
                          <RefreshCw size={14} /> Reset Analysis Module
                        </button>
                      </div>
                    </motion.div>
                  ) : isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 px-8">
                      <div className="relative mb-12">
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="w-40 h-40 rounded-full border-2 border-dashed border-sky-500/30"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.3)] flex items-center justify-center">
                            <Zap className="text-sky-400" size={32} />
                          </div>
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">
                        Neural Decoding...
                      </h3>
                      <div className="space-y-2 text-center">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest animate-pulse">
                          Scanning semantic structures...
                        </p>
                        <p className="text-slate-600 text-[10px] font-medium max-w-xs mx-auto">
                          Executing semantic overlap algorithm and formatting integrity audit with
                          Gemini-2.0 protocols.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 px-8 text-center bg-slate-900/40 border border-dashed border-white/10 rounded-[3rem]">
                      <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-800 mb-8">
                        <Layout size={40} />
                      </div>
                      <h3 className="text-xl font-black mb-2 text-slate-400 uppercase tracking-tight">
                        Intelligence Terminal
                      </h3>
                      <p className="text-slate-500 text-xs max-w-xs font-medium leading-relaxed">
                        Initialize the system by uploading your resume and target Job Description to
                        receive a comprehensive neural compatibility report.
                      </p>

                      <div className="mt-12 flex gap-4">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                          Keyword Mapping
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                          Format Audit
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="h-32"></div>
      </div>
    </MainLayout>
  );
}
