import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  Sparkles, Rocket, Bell, Home, Laptop, Award, Shield, Target, ArrowRight,
  Layout, Server, Layers, Database, BarChart3, Cpu, GitBranch, Lock, Code2, Orbit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login to join the waitlist for courses.");
      navigate('/auth');
      return;
    }

    try {
      if (email) {
        // Save interaction to Firestore
        await addDoc(collection(db, 'user_interactions'), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          type: 'course_waitlist',
          itemTitle: 'Next-Gen Course Access',
          itemLocation: 'Waitlist',
          timestamp: serverTimestamp()
        });

        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error("Error saving waitlist interaction:", err);
      // Still show success to user
      setSubscribed(true);
      setEmail('');
    }
  };


  const upcomingCourses = [
    { icon: <Layout className="text-sky-400" size={24} />, title: "Frontend Development", desc: "Master Modern UI/UX Architecture" },
    { icon: <Server className="text-indigo-400" size={24} />, title: "Backend Development", desc: "Scalable Infrastructure & APIs" },
    { icon: <Layers className="text-purple-400" size={24} />, title: "Full Stack Developer", desc: "End-to-End Application Delivery" },
    { icon: <Database className="text-emerald-400" size={24} />, title: "Database Management", desc: "SQL, NoSQL & Data Modeling" },
    { icon: <BarChart3 className="text-amber-400" size={24} />, title: "Data Analytics", desc: "Insights via Data Visualization" },
    { icon: <Cpu className="text-rose-400" size={24} />, title: "Data Science", desc: "ML, AI & Predictive Modeling" },
    { icon: <Orbit className="text-cyan-400" size={24} />, title: "N8N Automation", desc: "No-Code Workflow Engineering" },
    { icon: <Lock className="text-red-400" size={24} />, title: "Cyber Security", desc: "Pentesting & System Hardening" },
    { icon: <Code2 className="text-blue-400" size={24} />, title: "DSA & Algorithms", desc: "Foundation for Technical Interviews" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 overflow-x-hidden font-sans pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Courses" />
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest mb-6 shadow-glow"
          >
            <Sparkles size={12} className="animate-spin-slow" /> Coming Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Launch Your </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Next Chapter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            We're curating premium professional courses to turn you into a world-class talent.
            Industry-led, certification-driven, and designed for high performance.
          </motion.p>
        </div>

        {/* Hero Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group mb-20"
        >
          {/* Glowing Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              <div className="lg:col-span-12">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
                  <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center gap-3 justify-center md:justify-start">
                      <Rocket className="text-sky-500" /> System Initialization
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="h-2 flex-1 md:min-w-[200px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 2.5, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"
                        ></motion.div>
                      </div>
                      <span className="text-xs font-black text-sky-400 tabular-nums">88%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <Home size={14} /> Back to Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcomingCourses.map((course, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-all group overflow-hidden relative"
                    >
                      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        {React.cloneElement(course.icon, { size: 40 })}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 group-hover:bg-sky-500/10 transition-colors">
                        {React.cloneElement(course.icon, { size: 16 })}
                      </div>
                      <h4 className="font-black text-sm sm:text-base mb-1 tracking-tight group-hover:text-sky-400 transition-colors">{course.title}</h4>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/5 border border-sky-500/10 w-fit">
                        <div className="w-1 h-1 bg-sky-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-500/80">Incoming</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>


        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-b from-[#0f172a] to-transparent rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50"></div>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-10 text-center"
                >
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Access Early Access</h3>
                  <p className="text-slate-500 text-xs mb-8 font-medium uppercase tracking-widest">Join the waitlist for exclusive protocols.</p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative group/input">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="professional@email.com"
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-700 font-medium"
                      />
                      <button
                        type="submit"
                        className="mt-4 w-full py-4 bg-sky-500 text-black font-black rounded-2xl hover:bg-sky-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                      >
                        Join Waitlist <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 relative z-10"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
                    <Target size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Protocol Accepted</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Transmission confirmed.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-12">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span> Deploying Next-Gen Learning
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-32"></div>
    </div>
  );
}