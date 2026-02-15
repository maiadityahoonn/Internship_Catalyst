import MainLayout from "../layouts/MainLayout";
import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Initialize worker using static file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function ATSScoreChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isTagsProcessing, setIsTagsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setResumeText(""); // Clear previous text
    setProcessingError("");
    setIsTagsProcessing(true);

    try {
      const text = await extractText(file);
      console.log("Extracted text length:", text ? text.length : 0);

      if (text && text.trim().length > 15) {
        setResumeText(text);
        setProcessingError("");
      } else {
        const len = text ? text.trim().length : 0;
        setProcessingError(`Text too short (${len} chars). If this is a valid resume, it might be an image scan which is not supported.`);
      }
    } catch (err) {
      console.error("Processing error:", err);
      setProcessingError("Failed to process file. " + err.message);
    } finally {
      setIsTagsProcessing(false);
    }
  };

  const extractText = async (file) => {
    const fileType = file.type;
    console.log("Processing file type:", fileType);

    try {
      if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();

        // Use cMaps for better font support
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

          // Add spaces between items to preserve word boundaries
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }

        return text;
      } else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (fileType === "text/plain" || file.name.endsWith(".txt")) {
        return await file.text();
      } else {
        throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      throw error;
    }
  };

  const calculateATS = () => {
    if (!resumeText) {
      alert("Please upload a resume first and wait for processing to complete.");
      return;
    }
    if (!jobDescription) {
      alert("Please enter a job description.");
      return;
    }

    setIsAnalyzing(true);

    // Simulated delay for effect
    setTimeout(() => {
      // 1. Tokenize & Clean Text
      const cleanText = (text) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // Remove special chars
          .split(/\s+/) // Split by whitespace
          .filter((word) => word.length > 2); // Remove short words

      const jdKeywords = new Set(cleanText(jobDescription));
      const resumeKeywords = new Set(cleanText(resumeText));

      // Stop words to ignore (simple list)
      const stopWords = new Set(["the", "and", "for", "that", "with", "this", "from", "have", "are", "was", "will", "your", "with", "experience"]);

      const importantKeywords = [...jdKeywords].filter(k => !stopWords.has(k));

      if (importantKeywords.length === 0) {
        alert("Job description is too short or lacks keywords.");
        setIsAnalyzing(false);
        return;
      }

      // 2. Find Matches
      const matched = importantKeywords.filter((k) => resumeKeywords.has(k));
      const missing = importantKeywords.filter((k) => !resumeKeywords.has(k));

      // 3. Calculate Score
      const score = Math.round((matched.length / importantKeywords.length) * 100) || 0;

      setAnalysisResult({
        score,
        matched: matched.slice(0, 15),
        missing: missing.slice(0, 15),
      });

      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        {/* 🔹 HERO SECTION */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-sky-400">AI ATS Score Checker</h1>
          <p className="mt-3 text-sky-200 max-w-2xl mx-auto">
            Analyze your resume and check how well it matches ATS requirements.
          </p>
        </div>

        {/* 🔹 INPUT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT – UPLOAD RESUME */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-sky-500/20 hover:border-sky-500 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-4">Upload Resume</h2>

            <div
              className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-sky-500/40 rounded-lg text-sky-300 hover:bg-slate-800 transition cursor-pointer relative"
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              />
              <p className="text-sm">Drag & drop your resume or click to browse</p>
              <p className="text-xs mt-1 text-slate-400">(PDF / DOCX / TXT)</p>

              {isTagsProcessing && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-lg">
                  <p className="text-sky-400 animate-pulse font-semibold">Processing file...</p>
                </div>
              )}

              {fileName && !isTagsProcessing && !processingError && (
                <div className="mt-4 px-4 py-2 bg-slate-800 rounded text-green-400 font-mono text-sm border border-green-500/30 flex items-center gap-2">
                  <span>✓</span> {fileName}
                  <span className="text-xs text-slate-400 ml-2">({resumeText.length} chars)</span>
                </div>
              )}

              {processingError && (
                <div className="mt-4 px-4 py-2 bg-red-900/30 rounded text-red-400 font-mono text-xs border border-red-500/30 max-w-[90%] text-center">
                  ⚠ {processingError}
                </div>
              )}

              {!fileName && (
                <button className="mt-4 px-5 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition">
                  Browse File
                </button>
              )}
            </div>
          </div>

          {/* RIGHT – JOB DESCRIPTION */}
          <div className="bg-slate-900/60 p-6 rounded-xl border border-sky-500/20 hover:border-sky-500 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-4">Job Description</h2>
            <textarea
              rows="8"
              placeholder="Paste the job description here..."
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-sky-500 outline-none text-white resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 ANALYZE BUTTON */}
        <div className="mt-12 text-center">
          <button
            onClick={calculateATS}
            disabled={isAnalyzing || isTagsProcessing || !resumeText}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${(isAnalyzing || isTagsProcessing || !resumeText) ? "bg-slate-600 cursor-not-allowed opacity-50" : "bg-sky-500 hover:bg-sky-600 hover:scale-105"
              }`}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze ATS Score"}
          </button>
          {!resumeText && fileName && !isTagsProcessing && !processingError && (
            <p className="text-xs text-yellow-500 mt-2">Resume text empty. Please try re-uploading.</p>
          )}
        </div>

        {/* 🔹 RESULT SECTION */}
        {analysisResult && (
          <div className="mt-20 bg-slate-900/60 p-8 rounded-xl border border-sky-500/20 hover:border-sky-500 transition-all animate-fade-in">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">ATS Analysis Result</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* SCORE */}
              <div className="bg-slate-800 p-6 rounded-xl text-center hover:scale-105 transition-all">
                <p className="text-sky-300 text-sm">ATS Score</p>
                <div className="relative inline-flex items-center justify-center mt-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                    <circle
                      cx="64" cy="64" r="56"
                      stroke={analysisResult.score >= 70 ? "#22c55e" : analysisResult.score >= 40 ? "#eab308" : "#ef4444"}
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 - (351.86 * analysisResult.score) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold text-white">{analysisResult.score}%</span>
                </div>
              </div>

              {/* MATCHED SKILLS */}
              <div className="bg-slate-800 p-6 rounded-xl hover:scale-105 transition-all">
                <h4 className="text-green-400 font-semibold mb-3 border-b border-slate-700 pb-2">Matched Keywords</h4>
                <ul className="text-sky-200 text-sm space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {analysisResult.matched.length > 0 ? (
                    analysisResult.matched.map((kw, i) => <li key={i} className="flex items-center gap-2"><span className="text-green-500">✔</span> {kw}</li>)
                  ) : (
                    <li className="text-slate-500 italic">No matches found</li>
                  )}
                </ul>
              </div>

              {/* MISSING SKILLS */}
              <div className="bg-slate-800 p-6 rounded-xl hover:scale-105 transition-all">
                <h4 className="text-red-400 font-semibold mb-3 border-b border-slate-700 pb-2">Missing Keywords</h4>
                <ul className="text-sky-200 text-sm space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {analysisResult.missing.length > 0 ? (
                    analysisResult.missing.map((kw, i) => <li key={i} className="flex items-center gap-2"><span className="text-red-500">✖</span> {kw}</li>)
                  ) : (
                    <li className="text-green-500 italic">No missing keywords!</li>
                  )}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* 🔹 TIPS SECTION */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {["Use job-specific keywords", "Avoid images & tables in resume", "Use simple fonts & headings"].map((tip, i) => (
            <div key={i} className="bg-slate-900/60 p-5 rounded-xl border border-sky-500/20 hover:border-sky-500 transition">
              <p className="text-sky-300 text-sm">💡 {tip}</p>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
