import { Link } from "react-router-dom";
import { FaCheck, FaArrowRight, FaRobot, FaFileAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layout, TrendingUp, CheckCircle2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

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

export default function AIResumeTemplates() {
    return (
        <MainLayout noContainer={true}>
            <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-12 font-sans selection:bg-sky-500/30 overflow-x-hidden relative">

                {/* Background Ambience */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full"></div>
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest mb-6 shadow-glow"
                        >
                            <FaRobot /> AI Powered Resume Builder
                        </motion.div>
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Professional</span> <br className="sm:hidden" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-400">Templates</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
                        >
                            Choose from our collection of ATS-friendly, professionally designed templates to stand out from the crowd.
                            Optimized for <span className="text-sky-400 font-medium">99% parse rate</span>.
                        </motion.p>
                    </motion.div>

                    {/* Coming Soon Section */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <motion.div variants={fadeInUp} className="relative mb-8 group">
                            <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full group-hover:bg-sky-500/30 transition-all duration-500"></div>
                            <div className="relative bg-[#0F172A]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group-hover:border-sky-500/30 transition-all duration-500">
                                <FaRobot className="text-6xl text-sky-400 animate-bounce" />
                            </div>
                        </motion.div>
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 tracking-tighter"
                        >
                            Coming Soon
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-slate-400 text-base md:text-lg max-w-lg mx-auto mb-8 font-medium"
                        >
                            We are crafting a collection of premium, ATS-optimized templates powered by AI. Stay tuned for the launch!
                        </motion.p>

                        <motion.button
                            variants={fadeInUp}
                            className="px-8 py-4 rounded-xl bg-white text-black font-black tracking-widest text-xs hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 hover:scale-[1.05] active:scale-[0.95]"
                        >
                            <FaCheck className="text-sm" /> Notify Me When Ready
                        </motion.button>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mt-32"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Why Choose Our Templates?</h2>
                            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium">Engineered to pass Application Tracking Systems while impressing human recruiters.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "ATS Optimized",
                                    desc: "Parse-friendly structures that ensure your resume gets read by the bots.",
                                    icon: <FaRobot className="text-sky-400 text-4xl mb-4" />
                                },
                                {
                                    title: "Recruiter Approved",
                                    desc: "Clean, scan-able layouts preferred by hiring managers at FAANG companies.",
                                    icon: <FaCheck className="text-emerald-400 text-4xl mb-4" />
                                },
                                {
                                    title: "Smart Customization",
                                    desc: "Edit and update your resume in minutes with our intuitive AI-powered builder.",
                                    icon: <FaFileAlt className="text-purple-400 text-4xl mb-4" />
                                },
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    variants={fadeInUp}
                                    className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-sky-500/30 transition-all duration-300 group hover:bg-[#0f172a]/60"
                                >
                                    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-white/10">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-base md:text-lg font-black text-white mb-3 group-hover:text-sky-400 transition-colors tracking-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-slate-400 leading-relaxed text-xs font-medium">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 📘 EDUCATIONAL CONTENT SECTION */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="mt-32 space-y-16"
                    >
                        {/* 1. Resume Branding Masterclass */}
                        <motion.section variants={fadeInUp} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur opacity-50" />
                            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12">
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="md:w-1/3">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                                            <FaFileAlt size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4 tracking-tight uppercase">Resume <br /> Design Tips</h2>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            Your resume branding is your professional signature. Learn how to stand out.
                                        </p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { title: "Your Profile", desc: "Your summary should be 3 lines: What you do, what you've done, and what you aim to solve.", icon: <Sparkles size={18} /> },
                                            { title: "Layout Order", desc: "People usually look at the top left first. Put important skills there.", icon: <Layout size={18} /> },
                                            { title: "Using Numbers", desc: "For every point, try to use a number. For example, 'helped 50+ users'.", icon: <TrendingUp size={18} /> },
                                            { title: "White Space", desc: "Clean margins are essential for making your resume easy to read.", icon: <CheckCircle2 size={18} /> }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group/item">
                                                <div className="text-indigo-500 mb-4 group-hover/item:scale-110 transition-transform">{item.icon}</div>
                                                <h4 className="text-sm font-black mb-2 text-white">{item.title}</h4>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* 2. Action Verbs Handbook */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div variants={fadeInUp} className="p-8 rounded-[2.5rem] bg-sky-500/5 border border-sky-500/10">
                                <h3 className="text-lg font-black mb-6 text-sky-400">Tech & Build Verbs</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Architected", "Engineered", "Implemented", "Debugged", "Deployed", "Orchestrated", "Refactored", "Scaled", "Automated"].map((verb) => (
                                        <span key={verb} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all">
                                            {verb}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10">
                                <h3 className="text-lg font-black mb-6 text-purple-400">Leadership & Impact</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Spearheaded", "Mentored", "Pioneered", "Maximized", "Generated", "Standardized", "Transformed", "Influenced", "Accelerated"].map((verb) => (
                                        <span key={verb} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all">
                                            {verb}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* 3. Resume Dos and Don'ts */}
                        <motion.section variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-t border-white/5">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-emerald-400 tracking-[0.4em] uppercase">The Dos</h4>
                                <ul className="space-y-3">
                                    {[
                                        "Keep it to exactly one page.",
                                        "Use clear, easy to read text sizes.",
                                        "Put your graduation date clearly.",
                                        "Add links to your projects.",
                                        "Use simple section headings."
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-400">
                                            <FaCheck className="text-emerald-400 mt-1 shrink-0" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-rose-500 tracking-[0.4em] uppercase mb-12">The Don'ts</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Don't include a picture.",
                                        "Don't use bars for skill levels.",
                                        "Don't include old school details.",
                                        "Don't list references.",
                                        "Don't use complex charts."
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-400">
                                            <FaArrowRight className="text-rose-400 mt-1 shrink-0 rotate-45" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.section>
                    </motion.div>
                </div>
                <div className="h-32"></div>
            </div>
        </MainLayout>
    );
}
