import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import {
    FileText,
    Target,
    Lightbulb,
    Rocket,
    Cpu,
    ArrowRight,
    Sparkles,
    Zap,
    BrainCircuit,
    Bot,
    ChevronDown,
    ShieldCheck,
    ZapIcon,
    Search,
    CheckCircle2,
    Workflow,
    Globe,
    Database,
    Lock,
    Unlock,
    CreditCard,
    X,
    BadgePercent
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { isToolPurchased, purchaseTool, PRICING } from '../utils/aiMonetization';

export default function AIPage() {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState(null);
    const [selectedTool, setSelectedTool] = useState(null); // For Purchase Modal
    const [purchasedTools, setPurchasedTools] = useState([]);

    useEffect(() => {
        if (auth.currentUser) {
            const user = auth.currentUser;
            const statuses = aiTools.map(tool => ({
                id: tool.id,
                isOwned: isToolPurchased(user.uid, tool.id)
            }));
            setPurchasedTools(statuses);
        }
    }, []);

    const aiTools = [
        {
            id: "ai-resume",
            title: "AI Resume Templates",
            description: "Templates that pass company filters and look professional.",
            icon: <Bot className="text-sky-400" size={24} />,
            path: "/ai-resume-templates",
            features: ["Fast Pass", "Recruiter Approved", "Multi-layout"],
            color: "from-sky-500/20 to-blue-500/20",
            accent: "sky",
            price: 0
        },
        {
            id: "ats-checker",
            title: "Score Checker",
            description: "Full check of your resume logic and design.",
            icon: <Target className="text-indigo-400" size={24} />,
            path: "/ats-score-checker",
            features: ["Match Check", "Format Check", "Resume Fixes"],
            color: "from-indigo-500/20 to-purple-500/20",
            accent: "indigo",
            price: PRICING['ats-checker']
        },
        {
            id: "skill-gap",
            title: "Skill Analyzer",
            description: "Your own study plan and skill matching for any job.",
            icon: <Lightbulb className="text-purple-400" size={24} />,
            path: "/skill-gap-analyzer",
            features: ["Skill Match", "Study Plan", "Project Ideas"],
            color: "from-purple-500/20 to-pink-500/20",
            accent: "purple",
            price: PRICING['skill-gap']
        },
        {
            id: "cover-letter",
            title: "AI Cover Letter",
            description: "Great matching letters for better results in your job search.",
            icon: <Zap className="text-emerald-400" size={24} />,
            path: "/cover-letter-ai",
            features: ["Job Match", "Tone Change", "Get Ahead"],
            color: "from-emerald-500/20 to-teal-500/20",
            accent: "emerald",
            price: PRICING['cover-letter']
        }
    ];

    const handleToolClick = (tool) => {
        if (!auth.currentUser) {
            alert("Please login to use AI tools.");
            navigate('/auth');
            return;
        }

        const isOwned = isToolPurchased(auth.currentUser.uid, tool.id);
        if (isOwned || tool.price === 0) {
            navigate(tool.path);
        } else {
            setSelectedTool(tool);
        }
    };

    const handleConfirmPurchase = () => {
        if (selectedTool && auth.currentUser) {
            purchaseTool(auth.currentUser.uid, selectedTool.id, selectedTool.title, selectedTool.price);

            // Refresh local state
            const updated = aiTools.map(tool => ({
                id: tool.id,
                isOwned: isToolPurchased(auth.currentUser.uid, tool.id)
            }));
            setPurchasedTools(updated);

            const toolId = selectedTool.id;
            const toolUrl = selectedTool.path;

            setSelectedTool(null);
            alert(`Purchase successful! Access to ${selectedTool.title} unlocked.`);
            navigate(toolUrl);
        }
    };

    const isOwned = (toolId) => {
        const status = purchasedTools.find(t => t.id === toolId);
        return status ? status.isOwned : false;
    };

    const workflowSteps = [
        { icon: <Globe size={24} />, title: "Connect", desc: "Share your details or upload your resume." },
        { icon: <Cpu size={24} />, title: "Check", desc: "Our AI checks your data against top companies." },
        { icon: <AnimatePresence><ZapIcon size={24} /></AnimatePresence>, title: "Fix", desc: "Make your resume better with AI." },
        { icon: <CheckCircle2 size={24} />, title: "Finish", desc: "Download your files and apply for jobs." }
    ];

    const faqs = [
        {
            q: "How accurate is the ATS Score Checker?",
            a: "Our algorithm is trained on thousands of successfully processed resumes and mimics the logic of leading ATS software like Workday, Greenhouse, and Lever with over 95% accuracy."
        },
        {
            q: "Is my data safe and private?",
            a: "Absolutely. We encrypt all uploads and do not share your personal information with third parties. Your data is used exclusively to power the AI analysis for your account."
        },
        {
            q: "Can the AI really help me get an internship?",
            a: "Yes! By matching your skills with job descriptions and optimizing keywords, we've seen users get invited to 3x more interviews compared to traditional manual applications."
        },
        {
            q: "How does the Skill Gap Analyzer work?",
            a: "It compares your current skill set against the 'ideal' profile for your target role using real-time job market data, identifying specific technologies and certifications you need."
        }
    ];

    const valueProps = [
        { icon: <ShieldCheck className="text-sky-400" />, title: "Data Integrity", desc: "Enterprise-grade encryption for all your professional documents." },
        { icon: <ZapIcon className="text-amber-400" />, title: "Real-time Speed", desc: "Get comprehensive analysis and documents in under 10 seconds." },
        { icon: <BrainCircuit className="text-purple-400" />, title: "Deep Insights", desc: "Beyond simple keywords—we analyze the semantic meaning of your work." },
        { icon: <Database className="text-indigo-400" />, title: "Market Driven", desc: "Updated daily with trends from 10,000+ active job postings." },
        { icon: <Search className="text-emerald-400" />, title: "ATS Knowledge", desc: "Deep integration with the logic of all major recruitment systems." },
        { icon: <Lock className="text-rose-400" />, title: "Private Compute", desc: "Your career roadmap is yours alone. No public profiles unless you choose." }
    ];

    return (
        <MainLayout noContainer={true}>
            <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 overflow-x-hidden font-sans pb-15 relative">

                {/* 🌌 IMMERSIVE BACKGROUND */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-sky-500/5 blur-[150px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[150px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
                    <div className="absolute inset-0 opacity-[0.15]"
                        style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">

                    {/* 🚀 HERO SECTION */}
                    <div className="text-center pt-24 md:pt-32 mb-16 md:mb-32 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="animate-pulse" />PRO AI TOOLS
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[2.25rem] sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Boost Your </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500">Career</span>
                        </motion.h1>

                        <p className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12 px-4">
                            Get powerful AI career tools. Premium AI tools to help students get hired faster.
                        </p>
                    </div>

                    {/* ⚡ THE CORE TOOLS */}
                    <div className="mb-24 sm:mb-32 lg:mb-40">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2 text-white">AI Smart Tools</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aiTools.map((tool, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -8 }}
                                    onClick={() => handleToolClick(tool)}
                                    className="group relative h-full flex flex-col cursor-pointer"
                                >
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${tool.color} rounded-[2rem] blur opacity-10 group-hover:opacity-40 transition duration-500`}></div>

                                    <div className="relative flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 group-hover:border-sky-500/30 rounded-[2rem] p-8 flex flex-col transition-all duration-300">

                                        <div className="flex items-center justify-between w-full mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500/10 transition-colors">
                                                {React.cloneElement(tool.icon, { size: 20 })}
                                            </div>

                                            {isOwned(tool.id) || tool.price === 0 ? (
                                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                                                    <Unlock size={10} className="text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Unlocked</span>
                                                </div>
                                            ) : (
                                                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5">
                                                    <Lock size={10} className="text-amber-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">₹{tool.price}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-sm sm:text-base font-black mb-2 tracking-tighter uppercase group-hover:text-sky-400 transition-colors text-white">
                                            {tool.title}
                                        </h3>

                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                            {tool.description}
                                        </p>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex flex-wrap gap-2">
                                                {tool.features.map((f, idx) => (
                                                    <span key={idx} className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                            <button className={`w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isOwned(tool.id) || tool.price === 0
                                                ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                                                : "bg-white/5 border-white/10 text-slate-400 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-400 group-hover:shadow-lg group-hover:shadow-sky-500/20"
                                                }`}>
                                                {isOwned(tool.id) || tool.price === 0 ? "Start Tool" : "Get Access"} <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 🧩 WORKFLOW SECTION */}
                    <div className="mb-24 sm:mb-32 lg:mb-40 relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10 hidden lg:block"></div>

                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">How It Works</h2>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">The neural optimization pipeline</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                            {workflowSteps.map((step, i) => (
                                <div key={i} className="relative group flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-sky-400 mb-6 group-hover:border-sky-500/50 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-all relative z-10 bg-[#020617]">
                                        <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-sky-500 text-black flex items-center justify-center text-[10px] font-black">
                                            0{i + 1}
                                        </span>
                                        {step.icon}
                                    </div>
                                    <h4 className="text-sm font-black uppercase mb-2 text-white">{step.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium max-w-[200px] text-center leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🌟 VALUE PROPOSITIONS */}
                    <div className="mb-24 sm:mb-32 lg:mb-40 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-1 py-8">
                            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Why Our <br /><span className="text-sky-500">AI Works Better.</span></h2>
                            <p className="text-slate-500 text-xs font-semibold mb-8 leading-relaxed">
                                We've spent thousands of hours reverse-engineering recruitment algorithms so you don't have to. Our AI isn't just generating text; it's engineering opportunities.
                            </p>
                            <div className="p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10">
                                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2">Performance Data</p>
                                <p className="text-2xl font-black text-white">+240%</p>
                                <p className="text-xs font-bold text-slate-500">Average increase in profile visibility</p>
                            </div>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {valueProps.map((prop, i) => (
                                <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex gap-4">
                                    <div className="shrink-0 pt-1">{prop.icon}</div>
                                    <div>
                                        <h5 className="font-black text-sm uppercase mb-1 tracking-tight text-white">{prop.title}</h5>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{prop.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ❓ AI FAQ SECTION */}
                    <div className="mb-24 sm:mb-32 lg:mb-40 max-w-4xl mx-auto">
                        <div className="text-center mb-10 md:mb-16">
                            <h2 className="text-2xl sm:text-4xl font-black mb-3 tracking-tight uppercase">AI Protocol FAQ</h2>
                            <div className="h-0.5 w-12 bg-sky-500 mx-auto"></div>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`rounded-2xl border transition-all duration-300 ${activeFaq === i ? 'bg-sky-500/5 border-sky-500/30' : 'bg-slate-900/40 border-white/5'}`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full px-4 sm:px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-sky-400">
                                            <span className="text-sky-500 mr-3">Q.</span> {faq.q}
                                        </span>
                                        <ChevronDown className={`transition-transform duration-300 text-slate-500 ${activeFaq === i ? 'rotate-180 text-sky-500' : ''}`} size={16} />
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 text-slate-400 text-xs font-medium leading-relaxed border-t border-sky-500/10 mt-2">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 💳 PURCHASE MODAL */}
                <AnimatePresence>
                    {selectedTool && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedTool(null)}
                                className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md bg-slate-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                                {selectedTool.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-tight text-white">{selectedTool.title}</h3>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Activating Tool</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTool(null)}
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Access Tier</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Lifetime Pro</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-white tracking-tighter">₹{selectedTool.price}</span>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">One-time payment</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-white">Included in this Protocol</h4>
                                            {selectedTool.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                                                        <CheckCircle2 size={8} className="text-sky-400" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleConfirmPurchase}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            <CreditCard size={14} /> Buy Now
                                        </button>
                                        <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest leading-loose">
                                            By confirming, you agree to get lifetime access <br /> to the {selectedTool.title} system.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="h-32"></div>
            </div>
        </MainLayout>
    );
}
