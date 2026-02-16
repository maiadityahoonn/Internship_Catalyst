
// Forced update for UI sync
import { Link } from "react-router-dom";
import { FaCheck, FaArrowRight, FaRobot, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AIResumeTemplates() {
    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-glow"
                    >
                        <FaRobot /> AI Powered Resume Builder
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Professional</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500">Templates</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        Choose from our collection of ATS-friendly, professionally designed templates to stand out from the crowd.
                        Optimized for <span className="text-sky-400 font-medium">99% parse rate</span>.
                    </p>
                </div>

                {/* Coming Soon Section */}
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full group-hover:bg-sky-500/30 transition-all duration-500"></div>
                        <div className="relative bg-[#0F172A]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group-hover:border-sky-500/30 transition-all duration-500">
                            <FaRobot className="text-6xl text-sky-400 animate-bounce" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                        Coming Soon
                    </h2>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
                        We are crafting a collection of premium, ATS-optimized templates powered by AI. Stay tuned for the launch!
                    </p>
                </div>
                {/* Notify Button (Optional Interaction) */}
                <button className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20 flex items-center gap-2">
                    <FaCheck className="text-sm" /> Notify Me When Ready
                </button>
            </div>

            {/* Features Section */}
            <div className="mt-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Why Choose Our Templates?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Engineered to pass Application Tracking Systems while impressing human recruiters.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-sky-500/30 transition-all duration-300 group hover:bg-[#0f172a]/60"
                        >
                            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-white/10">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
