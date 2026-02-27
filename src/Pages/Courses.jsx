import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  Sparkles, Rocket, Bell, Home, Award, Shield, Target, ArrowRight,
  Layout, Server, Layers, Database, BarChart3, Cpu, Lock, Code2, Orbit,
  Zap, Brain, Users, Globe, ChevronDown, CheckCircle2, Star, Clock, Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 3D Background removed as per user request
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

export default function Courses() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const containerRef = useRef(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login to join the waitlist for courses.");
      navigate('/auth');
      return;
    }

    try {
      if (email) {
        await addDoc(collection(db, 'user_interactions'), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          type: 'course_waitlist',
          itemTitle: 'Premium Course Access',
          itemLocation: 'Waitlist',
          timestamp: serverTimestamp()
        });
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error("Error saving waitlist:", err);
      setSubscribed(true);
      setEmail('');
    }
  };

  const benefits = [
    {
      icon: <Brain className="text-sky-400" />,
      title: "AI-First Curriculum",
      desc: "Learn with advanced AI tools and build intelligent systems from day one.",
      color: "from-sky-500/20 to-transparent",
      size: "col-span-1 md:col-span-2"
    },
    {
      icon: <Users className="text-emerald-400" />,
      title: "Direct Mentorship",
      desc: "Connect with experts from top-tier companies.",
      color: "from-emerald-500/20 to-transparent",
      size: "col-span-1"
    },
    {
      icon: <Trophy className="text-amber-400" />,
      title: "Real Projects",
      desc: "Build professional portfolios that actually win jobs.",
      color: "from-amber-500/20 to-transparent",
      size: "col-span-1"
    },
    {
      icon: <Globe className="text-indigo-400" />,
      title: "Global Network",
      desc: "Join a community of 5000+ ambitious developers.",
      color: "from-indigo-500/20 to-transparent",
      size: "col-span-1 md:col-span-2"
    }
  ];

  const pathways = [
    { step: "01", title: "Select Track", desc: "Choose your professional domain based on your career goals." },
    { step: "02", title: "Master Core", desc: "Deep dive into fundamentals with hands-on practice modules." },
    { step: "03", title: "Build Portfolio", desc: "Craft industry-grade applications under expert guidance." },
    { step: "04", title: "Job Placement", desc: "Interview prep and direct referrals to hiring partners." }
  ];

  const upcomingCourses = [
    { icon: <Layout className="text-sky-400" size={24} />, title: "Frontend Development", desc: "Master Modern UI/UX Architecture", duration: "12 Weeks", level: "Beginner" },
    { icon: <Server className="text-indigo-400" size={24} />, title: "Backend Development", desc: "Scalable Infrastructure & APIs", duration: "10 Weeks", level: "Intermediate" },
    { icon: <Layers className="text-purple-400" size={24} />, title: "Full Stack Developer", desc: "End-to-End Application Delivery", duration: "24 Weeks", level: "Advanced" },
    { icon: <Database className="text-emerald-400" size={24} />, title: "Database Systems", desc: "SQL, NoSQL & Data Modeling", duration: "8 Weeks", level: "Beginner" },
    { icon: <BarChart3 className="text-amber-400" size={24} />, title: "Data Analytics", desc: "Insights via Data Visualization", duration: "12 Weeks", level: "Intermediate" },
    { icon: <Cpu className="text-rose-400" size={24} />, title: "Data Science", desc: "ML, AI & Predictive Modeling", duration: "16 Weeks", level: "Advanced" },
    { icon: <Orbit className="text-cyan-400" size={24} />, title: "N8N Automation", desc: "No-Code Workflow Engineering", duration: "6 Weeks", level: "Beginner" },
    { icon: <Lock className="text-red-400" size={24} />, title: "Cyber Security", desc: "Pentesting & System Hardening", duration: "14 Weeks", level: "Intermediate" },
    { icon: <Code2 className="text-blue-400" size={24} />, title: "DSA Foundations", desc: "Master Technical Interviews", duration: "10 Weeks", level: "Beginner" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 overflow-x-hidden font-sans pt-24 md:pt-32 pb-12">
      <SEO title="Courses" />

      {/* Background Decorative Elements - Reverted to gradient style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-12 sm:mb-16 md:mb-24 px-4"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest mb-8"
          >
            <Zap size={12} className="fill-sky-400" /> Career Accelerator
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tighter leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">Master the </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Digital Careers</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12"
          >
            We don't just teach code. We build careers. Access premium courses designed by industry experts to transform you into global talent.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-sky-400 transition-all hover:scale-105"
            >
              Explore Catalog <ChevronDown size={18} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all"
            >
              Return Home
            </button>
          </motion.div>
        </motion.div>

        {/* Bento Benefits Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20 md:mb-32"
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`${benefit.size} relative group overflow-hidden bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 transition-all hover:border-sky-500/30 shadow-2xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Pathway Section */}
        <div className="mb-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">How It Works</h2>
            <p className="text-slate-500 text-xs tracking-[0.3em] font-black">From Zero to Job-Ready Professional</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {pathways.map((path, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative group"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white/5 absolute -top-6 -left-2 sm:-top-10 sm:-left-4 group-hover:text-sky-500/10 transition-colors">{path.step}</div>
                <div className="relative pt-4">
                  <h4 className="text-xl font-black mb-3 text-sky-400">{path.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{path.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-[25%] -right-4 w-8 h-[2px] bg-gradient-to-r from-sky-500/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Course Catalog Section */}
        <div id="catalog" className="mb-16 sm:mb-20 md:mb-32">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 sm:mb-16 gap-6 sm:gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Upcoming Courses</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Currently preparing for our official launch. Join the waitlist to receive priority access for our beta release.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-black tracking-widest text-sky-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Users size={14} className="text-sky-400" />
                  </div>
                ))}
              </div>
              <span>Join 500+ Early Adopters</span>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingCourses.map((course, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group relative bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 overflow-hidden transition-all hover:border-sky-500/40"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  {course.icon}
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                    {course.icon}
                  </div>
                  <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[9px] font-black tracking-widest text-sky-400">
                    Beta Phase
                  </div>
                </div>

                <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-sky-400 transition-colors">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{course.desc}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500">
                    <Clock size={12} className="text-sky-500" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500">
                    <Star size={12} className="text-amber-500" /> {course.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Final CTA / Waitlist */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-[2rem] sm:rounded-[3rem] blur opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 overflow-hidden text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-500 mx-auto mb-8 animate-pulse shadow-glow">
                <Bell size={40} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Get Early Access</h2>
              <p className="text-slate-400 text-sm font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                Spots are limited. Join the waitlist to receive your welcome guide and exclusive discounts upon launch.
              </p>

              <AnimatePresence mode="wait">
                {!subscribed ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-sky-500 transition-all font-medium placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 bg-sky-500 text-black font-black rounded-2xl hover:bg-sky-400 transition-all shadow-lg hover:shadow-sky-500/20 active:scale-95"
                    >
                      Join Waitlist
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-black tracking-widest">
                      <CheckCircle2 size={16} /> Registration Successful
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
          </div>
        </motion.div>

        {/* Footer Accent */}
        <div className="mt-16 sm:mt-20 md:mt-32 pt-8 sm:pt-12 border-t border-white/5 flex flex-col items-center gap-4 sm:gap-6">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 text-[9px] sm:text-[10px] font-black tracking-widest text-slate-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Global Community
          </div>
          <p className="text-slate-600 text-[8px] sm:text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-center">Built for high performance developers</p>
        </div>
      </div>
    </div>
  );
}