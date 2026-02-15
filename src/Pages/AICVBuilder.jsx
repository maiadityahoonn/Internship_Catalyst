import MainLayout from "../layouts/MainLayout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft, FaUser, FaBriefcase, FaGraduationCap, FaTools,
  FaCode, FaGlobe, FaAward, FaBookOpen,
  FaHandHoldingHeart, FaDownload, FaSave, FaCloudUploadAlt,
  FaCertificate, FaPrint, FaFileAlt, FaChartLine, FaLightbulb, FaTrophy, FaLanguage, FaHeart, FaLink, FaBook, FaUsers
} from "react-icons/fa";
import ResumePreview from "../components/ResumePreview";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// Firebase Imports
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, setDoc, getDoc } from 'firebase/firestore';

export default function AICVBuilder() {
  const [step, setStep] = useState("templates"); // 'templates' | 'builder'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  // Fallback Templates (Production Level Defaults)
  const fallbackTemplates = [
    { id: 1, name: "Modern Clean", type: "General", color: "bg-slate-800" },
    { id: 2, name: "Academic Focus", type: "Fresher", color: "bg-blue-600" },
    { id: 3, name: "Corporate Pro", type: "Experienced", color: "bg-emerald-600" },
    { id: 4, name: "Tech Specialist", type: "Developer", color: "bg-indigo-600" },
    { id: 5, name: "Research CV", type: "Research", color: "bg-gray-600" },
    { id: 6, name: "Minimalist Star", type: "FAANG", color: "bg-black" },
  ];

  const [templates, setTemplates] = useState(fallbackTemplates);

  const previewMockData = {
    personalInfo: {
      fullName: "Prashant Singh",
      email: "prashant@example.com",
      phone: "+91-9876543210",
      address: "Nagpur, Maharashtra",
      city: "Nagpur",
      postalCode: "440013",
      country: "India",
      linkedin: "linkedin.com/in/prashant",
      github: "github.com/prashant",
      portfolio: "prashant.dev"
    },
    summary: "Motivated B.Tech Graduate with expertise in Cyber Security and Web Development.",
    education: [
      {
        degree: "B.Tech in Computer Science", school: "Shri Ramdeobaba College", year: "2020 - 2024", description: "CGPA: 8.5"
      }
    ],
    experience: [
      { title: "AWS Cloud Intern", company: "AICTE-Eduskills", startDate: "May 2023", endDate: "July 2023", description: "Deployed scalable AWS solutions. Managed EC2, S3, RDS instances." }
    ],
    projects: [
      { title: "Facial Authentication", technologies: "Python, React, Bootstrap", link: "", description: "Liveness detection system using Chrome Extension." },
      { title: "Realtime Chat App", technologies: "React, Firebase", link: "", description: "Real-time messaging using Cloud Firestore." }
    ],
    skills: [
      { name: "C++", level: "Expert" },
      { name: "Python", level: "Advanced" },
      { name: "ReactJS", level: "Intermediate" }
    ],
    achievements: [
      { title: "Cyber Week Volunteer", description: "Managed 300+ attendees." }
    ],
    publications: [],
    extracurriculars: [{ title: "Robotics Club Member", description: "Participated in state level competitions." }],
    languages: [{ name: "English" }, { name: "Hindi" }],
    software: [{ name: "VS Code", level: "Excellent" }],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023" },
      { name: "CompTIA Security+", issuer: "CompTIA", date: "2024" }
    ],
    volunteerWork: [
      { role: "Code Mentor", organization: "Local NGO", description: "Teaching basic coding to underprivileged kids." }
    ]
  };

  const initialFormData = {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    software: [],
    languages: [],
    achievements: [],
    publications: [],
    extracurriculars: [],
    certifications: [],
    volunteerWork: []
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch Templates and User Session on Mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch User Resume from Firestore
        try {
          const q = query(collection(db, "user_resumes"), where("user_id", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const resumeDoc = querySnapshot.docs[0];
            setResumeId(resumeDoc.id);
            setFormData(resumeDoc.data().content); // Assuming structure is { user_id, content: {...} }
          }
        } catch (err) {
          console.error("Error fetching resume:", err);
        }
      }
    });

    // Fallback templates are already set locally. 
    // If you want to fetch templates from Firestore:
    // const fetchTemplates = async () => { ... }

    return () => unsubscribe();
  }, []);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setStep("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (Array.isArray(formData[section]) && index !== null) {
      setFormData(prev => {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const addItem = (section, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], item]
    }));
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const prefillData = () => {
    setFormData(previewMockData);
  };

  const handleSaveResume = async () => {
    if (!user) {
      alert("Please login to save your resume!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user.uid,
        content: formData,
        template_id: selectedTemplate?.id,
        updated_at: new Date()
      };

      if (resumeId) {
        // Update existing resume
        const resumeRef = doc(db, "user_resumes", resumeId);
        await updateDoc(resumeRef, payload);
        alert("Resume updated successfully!");
      } else {
        // Create new resume
        const docRef = await addDoc(collection(db, "user_resumes"), payload);
        setResumeId(docRef.id);
        alert("Resume saved successfully!");
      }

    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;

    setLoading(true);
    try {
      // Capture at high resolution (3x) for clarity
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        windowWidth: 794, // Standard A4 width at 96 DPI
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-preview-container');
          // Reset transformations to ensure clean capture
          clonedElement.style.transform = "none";
          clonedElement.style.width = "794px";
          clonedElement.style.minHeight = "1123px"; // Minimum A4 height
          clonedElement.style.margin = "0";
          clonedElement.style.padding = "0";
          clonedElement.style.overflow = "visible";

          // Only ensure font smoothing, do NOT change spacing which breaks layout
          const style = clonedDoc.createElement('style');
          style.innerHTML = `* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF with default compression for better quality
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = formData.personalInfo?.fullName
        ? `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please use the "Print" button which is more reliable for ATS formats.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      {step === "templates" && (
        <div className="animate-fade-in space-y-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-6 drop-shadow-sm animate-slide-up">
              Build Your Career with AI
            </h1>
            <p className="text-sky-200 text-xl max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up-delay">
              Select a production-ready template to showcase your potential.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
            {templates.map((template) => (
              <div key={template.id} className="group relative bg-slate-900/40 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500 transition-all">
                <div className={`h-80 rounded-xl flex items-center justify-center mb-5 ${template.color} relative overflow-hidden`}>
                  <span className="font-bold text-white text-2xl">{template.name}</span>
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <button onClick={() => handleSelectTemplate(template)} className="w-40 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/30 font-bold">Use Template</button>
                    <button onClick={() => setPreviewTemplate(template)} className="w-40 py-2 bg-slate-800/80 text-white border border-white/20 rounded-full hover:bg-slate-700 transition-colors backdrop-blur-sm">Preview</button>
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold">{template.name}</h3>
                <p className="text-sky-200/50 text-sm">{template.type}</p>
              </div>
            ))}
          </div>

          {previewTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-slate-900">
              <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-sky-500/20">
                <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-sky-400">{previewTemplate.name}</span> Preview
                  </h2>
                  <button onClick={() => setPreviewTemplate(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50 flex justify-center">
                  <div className="w-full max-w-3xl bg-white shadow-2xl min-h-[1000px] transform scale-100 origin-top">
                    <ResumePreview template={previewTemplate} data={previewMockData} />
                  </div>
                </div>
                <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-4">
                  <button onClick={() => setPreviewTemplate(null)} className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">Close</button>
                  <button onClick={() => handleSelectTemplate(previewTemplate)} className="px-6 py-2 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-colors">Use This Template</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "builder" && (
        <div className="animate-fade-in text-white pb-20">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setStep("templates")} className="flex items-center text-sky-400 hover:text-white transition-colors">
              <FaArrowLeft className="mr-2" /> Back to Templates
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10"
                disabled={loading}
              >
                <FaDownload /> {loading ? "Generating..." : "Download PDF"}
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <FaPrint /> Print (ATS Friendly)
              </button>
              <button
                onClick={handleSaveResume}
                className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-lg flex items-center justify-center"
                title="Save to Cloud"
              >
                <FaCloudUploadAlt size={20} />
              </button>
            </div>
            <button onClick={prefillData} className="px-4 py-2 bg-slate-800 rounded text-xs text-sky-400 border border-sky-500/30 hover:bg-sky-500/10 transition-colors">
              Prefill Mock Data
            </button>
          </div>

          <div id="resume-form" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT – FORM */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaFileAlt className="text-sky-500" /> Resume Editor
              </h2>

              {/* Personal Info */}
              <details open className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaUser className="text-sky-400" /> <span className="font-semibold text-lg">Personal Info</span></div>
                </summary>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} />
                  <input type="email" placeholder="Email" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} />
                  <input type="text" placeholder="Phone" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
                  <input type="text" placeholder="Address" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} />
                  <input type="text" placeholder="City" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.city} onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)} />
                  <input type="text" placeholder="LinkedIn" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.linkedin} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} />
                  <input type="text" placeholder="GitHub" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.github} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} />
                  <input type="text" placeholder="Portfolio/Website" className="p-3 rounded bg-slate-800 border border-slate-700 w-full" value={formData.personalInfo.portfolio} onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)} />
                </div>
              </details>

              {/* Summary */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaFileAlt className="text-purple-400" /> <span className="font-semibold text-lg">Summary</span></div>
                </summary>
                <div className="p-4">
                  <textarea rows="4" className="w-full p-3 rounded bg-slate-800 border border-slate-700" placeholder="Professional Summary..." value={formData.summary} onChange={(e) => handleInputChange('root', 'summary', e.target.value)}></textarea>
                </div>
              </details>

              {/* Education */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaGraduationCap className="text-yellow-400" /> <span className="font-semibold text-lg">Education</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.education.map((edu, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Degree / Course" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={edu.degree} onChange={(e) => handleInputChange('education', 'degree', e.target.value, i)} />
                      <input type="text" placeholder="University / School" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={edu.school} onChange={(e) => handleInputChange('education', 'school', e.target.value, i)} />
                      <input type="text" placeholder="Year (e.g. 2020-2024)" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={edu.year} onChange={(e) => handleInputChange('education', 'year', e.target.value, i)} />
                      <textarea rows="2" placeholder="Major / Grade / Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={edu.description} onChange={(e) => handleInputChange('education', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('education', { degree: "", school: "", year: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Education</span></button>
                </div>
              </details>

              {/* Experience */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaChartLine className="text-green-400" /> <span className="font-semibold text-lg">Experience</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.experience.map((exp, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('experience', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Job Title" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={exp.title} onChange={(e) => handleInputChange('experience', 'title', e.target.value, i)} />
                      <input type="text" placeholder="Company" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={exp.company} onChange={(e) => handleInputChange('experience', 'company', e.target.value, i)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Start Date" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={exp.startDate} onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, i)} />
                        <input type="text" placeholder="End Date" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={exp.endDate} onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, i)} />
                      </div>
                      <textarea rows="2" placeholder="Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={exp.description} onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('experience', { title: "", company: "", startDate: "", endDate: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Experience</span></button>
                </div>
              </details>

              {/* Projects (New) */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaLightbulb className="text-orange-400" /> <span className="font-semibold text-lg">Projects</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.projects.map((proj, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('projects', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Project Title" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={proj.title} onChange={(e) => handleInputChange('projects', 'title', e.target.value, i)} />
                      <input type="text" placeholder="Technologies Used" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={proj.technologies} onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, i)} />
                      <input type="text" placeholder="Link / GitHub" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={proj.link} onChange={(e) => handleInputChange('projects', 'link', e.target.value, i)} />
                      <textarea rows="2" placeholder="Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={proj.description} onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('projects', { title: "", technologies: "", link: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Project</span></button>
                </div>
              </details>

              {/* Skills */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaTools className="text-red-400" /> <span className="font-semibold text-lg">Skills</span></div>
                </summary>
                <div className="p-4 space-y-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="flex gap-2 relative group/item">
                      <input type="text" placeholder="Skill Name" className="flex-1 p-2 bg-slate-800 rounded border border-slate-700" value={skill.name} onChange={(e) => handleInputChange('skills', 'name', e.target.value, i)} />
                      <select className="p-2 bg-slate-800 rounded border border-slate-700" value={skill.level} onChange={(e) => handleInputChange('skills', 'level', e.target.value, i)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button onClick={() => removeItem('skills', i)} className="text-red-500 px-2 hover:bg-red-500/10 rounded">×</button>
                    </div>
                  ))}
                  <button onClick={() => addItem('skills', { name: "", level: "Intermediate" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Skill</span></button>
                </div>
              </details>

              {/* Publications (New) */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaBook className="text-blue-400" /> <span className="font-semibold text-lg">Publications</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.publications.map((pub, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('publications', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Publication Title" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={pub.title} onChange={(e) => handleInputChange('publications', 'title', e.target.value, i)} />
                      <input type="text" placeholder="Link (Optional)" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={pub.link} onChange={(e) => handleInputChange('publications', 'link', e.target.value, i)} />
                      <textarea rows="2" placeholder="Description/Details" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={pub.description} onChange={(e) => handleInputChange('publications', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('publications', { title: "", link: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Publication</span></button>
                </div>
              </details>

              {/* Achievements (New) */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaTrophy className="text-yellow-500" /> <span className="font-semibold text-lg">Achievements</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('achievements', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Achievement Title" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={ach.title} onChange={(e) => handleInputChange('achievements', 'title', e.target.value, i)} />
                      <textarea rows="2" placeholder="Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={ach.description} onChange={(e) => handleInputChange('achievements', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('achievements', { title: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Achievement</span></button>
                </div>
              </details>

              {/* Extracurriculars */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaHandHoldingHeart className="text-pink-400" /> <span className="font-semibold text-lg">Extracurriculars</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.extracurriculars.map((extra, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('extracurriculars', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Activity / Role" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={extra.title} onChange={(e) => handleInputChange('extracurriculars', 'title', e.target.value, i)} />
                      <textarea rows="2" placeholder="Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={extra.description} onChange={(e) => handleInputChange('extracurriculars', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('extracurriculars', { title: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Activity</span></button>
                </div>
              </details>

              {/* Certifications (New for ATS) */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaCertificate className="text-cyan-400" /> <span className="font-semibold text-lg">Certifications</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.certifications?.map((cert, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('certifications', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Certificate Name" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={cert.name} onChange={(e) => handleInputChange('certifications', 'name', e.target.value, i)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Issuer (e.g. AWS, Google)" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={cert.issuer} onChange={(e) => handleInputChange('certifications', 'issuer', e.target.value, i)} />
                        <input type="text" placeholder="Date / Year" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={cert.date} onChange={(e) => handleInputChange('certifications', 'date', e.target.value, i)} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('certifications', { name: "", issuer: "", date: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Certification</span></button>
                </div>
              </details>

              {/* Volunteer Work (New for ATS) */}
              <details className="group bg-slate-900/60 rounded-xl border border-sky-500/20 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50">
                  <div className="flex items-center gap-3"><FaHandHoldingHeart className="text-emerald-400" /> <span className="font-semibold text-lg">Volunteer Work</span></div>
                </summary>
                <div className="p-4 space-y-4">
                  {formData.volunteerWork?.map((vol, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded border border-slate-700 space-y-3 relative group/item">
                      <button onClick={() => removeItem('volunteerWork', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs hover:underline">Remove</button>
                      <input type="text" placeholder="Role" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={vol.role} onChange={(e) => handleInputChange('volunteerWork', 'role', e.target.value, i)} />
                      <input type="text" placeholder="Organization" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={vol.organization} onChange={(e) => handleInputChange('volunteerWork', 'organization', e.target.value, i)} />
                      <textarea rows="2" placeholder="Description" className="w-full p-2 rounded bg-slate-900/50 border border-slate-700" value={vol.description} onChange={(e) => handleInputChange('volunteerWork', 'description', e.target.value, i)}></textarea>
                    </div>
                  ))}
                  <button onClick={() => addItem('volunteerWork', { role: "", organization: "", description: "" })} className="w-full py-2 border border-dashed border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/10 transition-colors flex items-center justify-center gap-2"><span>+ Add Volunteer Work</span></button>
                </div>
              </details>

            </div>

            {/* RIGHT – LIVE PREVIEW */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-slate-800 p-2 rounded-xl border border-sky-500/20 shadow-2xl overflow-hidden">
                <div id="resume-preview-container" className="origin-top scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 min-h-[800px] w-full bg-white">
                  <ResumePreview template={selectedTemplate} data={formData} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </MainLayout>
  );
}
