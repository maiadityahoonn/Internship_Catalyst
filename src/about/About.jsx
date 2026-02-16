import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRocket,
  FaUsers,
  FaBullseye,
  FaLightbulb,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaGlobe,
  FaCode,
  FaChartBar,
  FaRobot,
  FaBrain,
  FaDatabase,
  FaBullhorn,
  FaStar,
  FaGraduationCap,
  FaLaptopCode
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { Sparkles, Target, Zap as ZapLucide, Cpu, Search, CheckCircle2, ChevronRight, Info, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  {
    role: "Founder",
    name: "Aditya Kumar Gupta",
    desc: "The creative driving force behind Internship Catalyst, envisioning a platform that transforms career development.",
    icon: <FaRocket className="text-sky-400" size={24} />,
    color: "from-sky-500/20 to-blue-500/20",
    image: null
  },
  {
    role: "Co-Founder",
    name: "Meraj Hussain",
    desc: "The strategic backbone of the organization, responsible for scaling operations and building strong partnerships.",
    icon: <FaBullseye className="text-indigo-400" size={24} />,
    color: "from-indigo-500/20 to-purple-500/20",
    image: null
  },
  {
    role: "Managing Director",
    name: "Akib Raza",
    desc: "Oversees daily operations with exceptional leadership skills. Ensures smooth execution of company goals.",
    icon: <FaShieldAlt className="text-emerald-400" size={24} />,
    color: "from-emerald-500/20 to-teal-500/20",
    image: null
  },
  {
    role: "Marketing Expert",
    name: "Kumar Nishu",
    desc: "Shapes the brand narrative and develops innovative marketing strategies. Excels at creating compelling campaigns.",
    icon: <FaBullhorn className="text-amber-400" size={24} />,
    color: "from-amber-500/20 to-orange-500/20",
    image: null
  },
  {
    role: "Database Expert",
    name: "Ajeet Kumar",
    desc: "Manages and optimizes our robust database infrastructure. Implements efficient data solutions.",
    icon: <FaDatabase className="text-blue-400" size={24} />,
    color: "from-blue-500/20 to-cyan-500/20",
    image: null
  },
  {
    role: "UI Specialist",
    name: "Shivam Saket",
    desc: "Crafts beautiful and intuitive user interfaces that delight users. Combines artistic vision with technical expertise.",
    icon: <FaCode className="text-pink-400" size={24} />,
    color: "from-pink-500/20 to-rose-500/20",
    image: null
  },
  {
    role: "Data Analytics",
    name: "Thakur Kumar",
    desc: "Transforms raw data into actionable insights, helping businesses make informed decisions with precision.",
    icon: <FaChartBar className="text-teal-400" size={24} />,
    color: "from-teal-500/20 to-emerald-500/20",
    image: null
  },
  {
    role: "Data Science",
    name: "Nagendra Kushwaha",
    desc: "Specializes in uncovering patterns and trends in data, driving strategic growth through advanced analytical techniques.",
    icon: <FaBrain className="text-purple-400" size={24} />,
    color: "from-purple-500/20 to-indigo-500/20",
    image: null
  },
  {
    role: "Automation Expert",
    name: "Ankit Kumar Gupta",
    desc: "Streamlines workflows and enhances productivity by designing efficient automation solutions.",
    icon: <FaBolt className="text-yellow-400" size={24} />,
    color: "from-yellow-500/20 to-amber-500/20",
    image: null
  },
];

const values = [
  {
    title: "Innovation First",
    desc: "We use AI to solve real-world career hurdles.",
    icon: <Sparkles className="text-sky-400" size={20} />
  },
  {
    title: "Skill Centric",
    desc: "Our courses focus on high-demand industry skills.",
    icon: <FaGraduationCap className="text-purple-400" size={20} />
  },
  {
    title: "Growth Mindset",
    desc: "Helping students upskill every day with premium content.",
    icon: <ZapLucide className="text-amber-400" size={20} />
  }
];

const courseHighlights = [
  {
    title: "Industry Aligned",
    desc: "Curriculums designed by working professionals from top MNCs.",
    icon: <FaLaptopCode size={24} className="text-sky-400" />
  },
  {
    title: "Live Projects",
    desc: "Work on real-world case studies to build a strong portfolio.",
    icon: <Layers size={24} className="text-indigo-400" />
  },
  {
    title: "Certified Skills",
    desc: "Get industry-recognized certifications upon completion.",
    icon: <CheckCircle2 size={24} className="text-emerald-400" />
  }
];

const About = () => {
  const navigate = useNavigate();

  return (
    <MainLayout noContainer={true} seo={{ title: "About Us | Internship Catalyst", description: "Learn more about our mission and the team behind Internship Catalyst." }}>
      <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 overflow-x-hidden font-sans pb-24 relative">

        {/* 🌌 IMMERSIVE BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-sky-500/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">

          {/* 🚀 HERO SECTION */}
          <div className="text-center pt-24 md:pt-32 mb-16 md:mb-32 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <Sparkles size={14} className="animate-pulse" /> OUR STORY & MISSION
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[1.75rem] xs:text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight px-2"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Transforming </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500">Careers</span>
            </motion.h1>

            <p className="text-slate-400 text-sm md:text-lg lg:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-12 px-6 text-center">
              Internship Catalyst is a comprehensive platform designed to bridge the gap between ambitious job seekers and exciting career opportunities. We empower students and professionals with AI-powered tools to excel in their journey.
            </p>

            {/* VALUES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm group hover:border-sky-500/30 transition-all shadow-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">{v.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 👥 TEAM SECTION */}
          <div className="mb-24 sm:mb-32 lg:mb-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2 text-white">Our Visionary Team</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-full flex flex-col"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-[2rem] blur opacity-10 group-hover:opacity-40 transition duration-500`}></div>

                  <div className="relative flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 group-hover:border-sky-500/30 rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-300">
                    {/* IMAGE PLACEHOLDER */}
                    <div className="mb-6 relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:border-sky-500/30 transition-all flex items-center justify-center">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-slate-700 group-hover:text-sky-500 transition-colors">
                          <FaUsers size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="flex flex-col mb-4 items-center">
                      <h3 className="text-lg font-black tracking-tight text-white uppercase group-hover:text-sky-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">
                        {member.role}
                      </p>
                    </div>

                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                      "{member.desc}"
                    </p>

                    <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-center items-center">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Core Contributor</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 📚 COURSES FOCUS SECTION */}
          <div className="mb-24 sm:mb-32 lg:mb-40 relative">
            <div className="absolute -inset-4 bg-sky-500/5 blur-[100px] rounded-[5rem] -z-10" />
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <FaGraduationCap size={12} /> Skill Development
              </motion.div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase text-white">Focus on High-Demand Skills</h2>
              <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
                Beyond job listings, we provide the learning paths needed to secure them. Our curated premium courses are designed to bridge the skill gap instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courseHighlights.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-sky-500/20 transition-all text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-lg">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-white mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 🧩 MISSION & STATS */}
          <div className="mb-24 sm:mb-32 lg:mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter text-white">We’re on a journey to <br /><span className="text-sky-500">Empower Millions.</span></h2>
              <p className="text-slate-500 text-sm font-semibold mb-8 leading-relaxed max-w-lg">
                From a small visionary project to a premium career portal, we are dedicated to helping every student find their place in the industry. Our tools are built to make you job-ready.
              </p>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10 text-center xs:text-left">
                  <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Students</p>
                  <p className="text-3xl font-black text-white">1000+</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 text-center xs:text-left">
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">MNC Partners</p>
                  <p className="text-3xl font-black text-white">50+</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center overflow-hidden">
                <div className="w-20 h-20 rounded-3xl bg-sky-500/10 mx-auto flex items-center justify-center text-sky-400 mb-8 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                  <FaStar size={40} className="text-sky-400" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">Our Mission Goal</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  "To provide everyone, regardless of their background, with the high-tech tools needed to crack elite hiring algorithms and land their dream job."
                </p>
              </div>
            </div>
          </div>

          {/* 🚀 CTA SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative px-6 py-16 md:p-16 rounded-[3rem] bg-gradient-to-br from-sky-500/10 via-slate-900 to-indigo-500/10 border border-white/10 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Ready to Start?</h2>
              <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
                Join Internship Catalyst today and unlock your true potential with our AI-powered ecosystem.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 md:px-10 md:py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 flex items-center gap-3 mx-auto"
              >
                Get Started Free <FaArrowRight size={16} />
              </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-500/5 blur-[120px] -z-0"></div>
          </motion.div>

        </div>

        <div className="h-32"></div>
      </div>
    </MainLayout>
  );
};

export default About;
