import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import {
    FileText,
    Target,
    Lightbulb,
    Rocket,
    Cpu,
    BadgePercent,
    ArrowLeft,
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
    ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { isToolPurchased, recordPurchase, getActiveTools, PRICING, AI_TOOLS } from '../utils/aiMonetization';
import * as LucideIcons from 'lucide-react';

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

export default function AIPage() {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState(null);
    const [purchasedTools, setPurchasedTools] = useState([]);


    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        if (auth.currentUser) {
            checkAccess();
        }
    }, [auth.currentUser]);

    const checkAccess = async () => {
        const activeTools = await getActiveTools(auth.currentUser.uid);
        setPurchasedTools(activeTools);
    };

    // Use AI_TOOLS from utility
    const aiToolsList = AI_TOOLS.map(tool => ({
        ...tool,
        price: PRICING[tool.id].sale,
        actualPrice: PRICING[tool.id].actual,
        icon: React.createElement(LucideIcons[tool.iconName] || LucideIcons.Bot, { size: 24 })
    }));

    const handleToolClick = (tool) => {
        if (!auth.currentUser) {
            alert("Please login to use AI tools.");
            navigate('/auth');
            return;
        }

        const owns = isOwned(tool.id);
        if (owns || tool.price === 0) {
            navigate(tool.path);
        } else {
            navigate(`/ai/checkout/${tool.id}`);
        }
    };


    const isOwned = (toolId) => {
        return purchasedTools.includes(toolId);
    };

    const workflowSteps = [
        { icon: <Globe size={24} />, title: "Share", desc: "Upload your resume or share your details." },
        { icon: <Cpu size={24} />, title: "Process", desc: "Our AI checks your data against top companies." },
        { icon: <ZapIcon size={24} />, title: "Improve", desc: "AI helps you fix mistakes and look better." },
        { icon: <CheckCircle2 size={24} />, title: "Download", desc: "Get your files ready to apply for jobs." }
    ];

    const faqs = [
        {
            q: "How good is the ATS Score Checker?",
            a: "It is very accurate. It works just like the software big companies use to scan resumes. It helped thousands of students already."
        },
        {
            q: "Is my personal data safe?",
            a: "Yes, 100%. We keep your files locked and private. We never share your data with anyone else."
        },
        {
            q: "Will this really help me get a job?",
            a: "Yes! Students using our AI tools get 3 times more interview calls because their resumes match what companies want."
        },
        {
            q: "How does the Skill Gap Analyzer help?",
            a: "It tells you exactly what to learn to get the job you want. No more guessing—just a clear plan to follow."
        }
    ];

    const valueProps = [
        { icon: <ShieldCheck className="text-sky-400" />, title: "Locked & Safe", desc: "Your files are kept very safe with high-level security." },
        { icon: <ZapIcon className="text-amber-400" />, title: "Super Fast", desc: "Get your resume analysis and results in just 10 seconds." },
        { icon: <BrainCircuit className="text-purple-400" />, title: "Deep Check", desc: "AI checks your work deeply, not just simple words." },
        { icon: <Database className="text-indigo-400" />, title: "Market Ready", desc: "Updated every day with new jobs from top companies." },
        { icon: <Search className="text-emerald-400" />, title: "ATS Friendly", desc: "Build resumes that pass the company’s scanning software." },
        { icon: <Lock className="text-rose-400" />, title: "Private Plan", desc: "Your career plan is only for you. No one can see it." }
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
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="text-center pt-24 md:pt-32 mb-16 md:mb-32 relative"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold tracking-widest mb-6 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="animate-pulse" />PRO AI TOOLS
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Boost Your </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500">Career</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
                        >
                            Get powerful AI tools to help you get hired faster. Easy to use, recruiter-approved, and made for students.
                        </motion.p>
                    </motion.div>

                    {/* ⚡ THE CORE TOOLS */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mb-24 sm:mb-32 lg:mb-40"
                    >
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 text-white">AI Smart Tools</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full"></div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aiToolsList.map((tool, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                    onClick={() => handleToolClick(tool)}
                                    className="group relative h-full flex flex-col cursor-pointer"
                                >
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${tool.color} rounded-[2rem] blur opacity-10 group-hover:opacity-40 transition duration-500`}></div>

                                    <div className="relative flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 group-hover:border-sky-500/30 rounded-[2rem] p-6 sm:p-8 flex flex-col transition-all duration-300">

                                        <div className="flex items-center justify-between w-full mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500/10 transition-colors">
                                                {React.cloneElement(tool.icon, { size: 20 })}
                                            </div>

                                            {isOwned(tool.id) || tool.price === 0 ? (
                                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                                                    <Unlock size={10} className="text-emerald-400" />
                                                    <span className="text-[10px] font-black tracking-widest text-emerald-400">Unlocked</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-slate-500 line-through">₹{tool.actualPrice}</span>
                                                    <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center gap-1.5 mt-1">
                                                        <ZapIcon size={10} className="text-sky-400" />
                                                        <span className="text-[10px] font-black tracking-widest text-sky-400">₹{tool.price}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-base md:text-lg font-black mb-2 tracking-tight group-hover:text-sky-400 transition-colors text-white">
                                            {tool.title}
                                        </h3>

                                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                                            {tool.description}
                                        </p>

                                        <div className="py-2 mb-4 border-y border-white/5">
                                            <p className="text-[9px] font-black tracking-tighter text-sky-500/70">
                                                90 Days Access Protocol
                                            </p>
                                        </div>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex flex-wrap gap-2">
                                                {tool.features.map((f, idx) => (
                                                    <span key={idx} className="text-[9px] font-bold text-slate-500 tracking-tighter bg-white/5 px-2 py-0.5 rounded">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                            <button className={`w-full py-3 rounded-xl border text-[10px] font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isOwned(tool.id) || tool.price === 0
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
                    </motion.div>

                    {/* 🧩 WORKFLOW SECTION */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mb-24 sm:mb-32 lg:mb-40 relative"
                    >
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10 hidden lg:block"></div>

                        <motion.div variants={fadeInUp} className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight">How It Works</h2>
                            <p className="text-slate-500 text-[9px] font-bold tracking-[0.2em]">The neural optimization pipeline</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                            {workflowSteps.map((step, i) => (
                                <motion.div key={i} variants={fadeInUp} className="relative group flex flex-col items-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-sky-400 mb-6 group-hover:border-sky-500/50 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-all relative z-10 bg-[#020617]">
                                        <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-sky-500 text-black flex items-center justify-center text-[10px] font-black">
                                            0{i + 1}
                                        </span>
                                        {step.icon}
                                    </div>
                                    <h4 className="text-sm md:text-base font-black mb-2 text-white">{step.title}</h4>
                                    <p className="text-slate-400 text-xs font-medium max-w-[200px] text-center leading-relaxed">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 🌟 VALUE PROPOSITIONS */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mb-24 sm:mb-32 lg:mb-40 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12"
                    >
                        <motion.div variants={fadeInUp} className="lg:col-span-1">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight">Why Our <br /><span className="text-sky-500">AI Works Better.</span></h2>
                            <p className="text-slate-400 text-xs font-semibold mb-8 leading-relaxed">
                                We've spent thousands of hours reverse-engineering recruitment algorithms so you don't have to. Our AI isn't just generating text; it's engineering opportunities.
                            </p>
                            <div className="p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10">
                                <p className="text-[10px] font-black text-sky-500 tracking-widest mb-2">Performance Data</p>
                                <p className="text-2xl font-black text-white">+240%</p>
                                <p className="text-xs font-bold text-slate-500">Average increase in profile visibility</p>
                            </div>
                        </motion.div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {valueProps.map((prop, i) => (
                                <motion.div key={i} variants={fadeInUp} className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex gap-4">
                                    <div className="shrink-0 pt-1">{prop.icon}</div>
                                    <div>
                                        <h5 className="font-black text-base md:text-lg mb-1 tracking-tight text-white">{prop.title}</h5>
                                        <p className="text-slate-400 text-xs font-medium leading-relaxed">{prop.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ❓ AI FAQ SECTION */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mb-24 sm:mb-32 lg:mb-40 max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="text-center mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight">AI Protocol FAQ</h2>
                            <div className="h-0.5 w-12 bg-sky-500 mx-auto"></div>
                        </motion.div>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className={`rounded-2xl border transition-all duration-300 ${activeFaq === i ? 'bg-sky-500/5 border-sky-500/30' : 'bg-slate-900/40 border-white/5'}`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full px-4 sm:px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <span className="text-xs font-black tracking-tight text-white group-hover:text-sky-400">
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>


                <div className="h-32"></div>
            </div>
        </MainLayout>
    );
}
