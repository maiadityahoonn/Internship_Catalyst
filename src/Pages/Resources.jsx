import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFileAlt,
  FaCheckCircle,
  FaBrain,
  FaPen,
  FaArrowRight,
} from 'react-icons/fa';

export default function Resources() {
  const resources = [
    {
      icon: <FaFileAlt className="text-blue-400" size={28} />,
      title: "AI Resume Builder",
      description: "Create professional, ATS-optimized resumes in minutes with AI-powered assistance.",
      path: "/ai-cv-builder",
      color: "from-blue-600 to-blue-400",
      features: ["AI-powered templates", "ATS optimization", "Real-time preview"]
    },
    {
      icon: <FaCheckCircle className="text-emerald-400" size={28} />,
      title: "ATS Score Checker",
      description: "Check your resume's compatibility with Applicant Tracking Systems and get improvement tips.",
      path: "/ats-score-checker",
      color: "from-emerald-600 to-emerald-400",
      features: ["Score analysis", "Keywords optimization", "Detailed report"]
    },
    {
      icon: <FaBrain className="text-purple-400" size={28} />,
      title: "AI Skill Gap Analyzer",
      description: "Identify skill gaps and get personalized learning recommendations for your career growth.",
      path: "/skill-gap-analyzer",
      color: "from-purple-600 to-purple-400",
      features: ["Skill assessment", "Gap analysis", "Learning paths"]
    },
    {
      icon: <FaPen className="text-pink-400" size={28} />,
      title: "AI Cover Letter Generator",
      description: "Generate compelling, personalized cover letters tailored to any job position.",
      path: "/cover-letter-ai",
      color: "from-pink-600 to-pink-400",
      features: ["Multiple tones", "Job-specific", "Editable content"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-purple-400">
            All Resources
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful AI-driven tools to accelerate your career growth and stand out to employers
          </p>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Gradient Background */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${resource.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300`}></div>

              {/* Card */}
              <div className="relative bg-slate-900/80 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {resource.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-sky-300 transition-colors">
                  {resource.title}
                </h3>

                <p className="text-slate-400 mb-6 flex-grow">
                  {resource.description}
                </p>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  {resource.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Link
                  to={resource.path}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${resource.color} text-white font-semibold hover:shadow-lg transition-all duration-300 group-hover:translate-x-2`}
                >
                  Get Started <FaArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            { label: "4 Powerful Tools", value: "100%" },
            { label: "AI-Driven Features", value: "24/7" },
            { label: "Career Impact", value: "2x+" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-400 mb-2">
                {stat.value}
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-slate-400 mb-6">
            Ready to transform your career?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105"
          >
            Explore More <FaArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
