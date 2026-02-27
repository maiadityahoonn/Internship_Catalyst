import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Typewriter } from "react-simple-typewriter"
import { Canvas, useFrame } from '@react-three/fiber';
import {
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaRobot,
  FaLaptopCode,
  FaChartLine,
  FaStar,
  FaSearch,
  FaArrowRight,
  FaBolt,
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaVideo,
  FaBullhorn,
} from 'react-icons/fa';
import { SiFlipkart, SiInfosys } from 'react-icons/si';
import { FaMeta } from 'react-icons/fa6';

//  INTERACTIVE PARTICLE SPHERE
function ParticlePoints() {
  const sphereRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const TOTAL = 3200;
  const TEXT_COUNT = 1600;
  const RADIUS = 4.5;

  // ================= SPHERE =================
  const spherePositions = useMemo(() => {
    const arr = new Float32Array(TOTAL * 3);

    for (let i = 0; i < TOTAL; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      arr[i * 3] = RADIUS * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = RADIUS * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = RADIUS * Math.cos(phi);
    }

    return arr;
  }, []);

  // ================= TEXT TARGET =================
  const textTargets = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 500, 300);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Balanced 2-line layout
    ctx.font = "bold 38px Arial";
    ctx.fillText("Welcome to", 250, 120);

    ctx.font = "bold 48px Arial";
    ctx.fillText("Internship Catalyst", 250, 175);
    const data = ctx.getImageData(0, 0, 500, 300).data;
    const pts = [];

    for (let y = 0; y < 300; y += 3) {
      for (let x = 0; x < 500; x += 3) {
        const index = (y * 500 + x) * 4;
        if (data[index + 3] > 128) {
          const px = (x - 250) / 85;
          const py = (150 - y) / 85;
          const pz = 3.3; // slightly inside sphere surface

          pts.push(px, py, pz);
        }
      }
    }

    const final = new Float32Array(TEXT_COUNT * 3);
    for (let i = 0; i < TEXT_COUNT; i++) {
      const j = (i % (pts.length / 3)) * 3;
      final[i * 3] = pts[j];
      final[i * 3 + 1] = pts[j + 1];
      final[i * 3 + 2] = pts[j + 2];
    }

    return final;
  }, []);

  // Initial text positions start from sphere
  const textPositions = useMemo(() => {
    const arr = new Float32Array(TEXT_COUNT * 3);

    for (let i = 0; i < TEXT_COUNT; i++) {
      arr[i * 3] = spherePositions[i * 3];
      arr[i * 3 + 1] = spherePositions[i * 3 + 1];
      arr[i * 3 + 2] = spherePositions[i * 3 + 2];
    }

    return arr;
  }, [spherePositions]);

  // ================= ANIMATION =================
  useFrame(() => {
    if (!sphereRef.current || !textRef.current) return;

    // Sphere slow rotation
    sphereRef.current.rotation.y += 0.001;
    sphereRef.current.rotation.x += 0.0005;

    if (hovered) {
      sphereRef.current.rotation.y += 0.01 + mouse.x * 0.01;
      sphereRef.current.rotation.x += 0.005 + mouse.y * 0.01;
      sphereRef.current.scale.set(1.05, 1.05, 1.05);
    } else {
      sphereRef.current.scale.set(1, 1, 1);
    }

    // Animate text particles
    const pos = textRef.current.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i++) {
      const target = hovered ? textTargets[i] : spherePositions[i];
      pos[i] += (target - pos[i]) * 0.06;
    }

    textRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerMove={(e) => {
        const { x, y } = e.unprojectedPoint || { x: 0, y: 0 };
        setMouse({ x, y });
      }}
    >
      {/* MAIN SPHERE */}
      <points ref={sphereRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={spherePositions}
            count={spherePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={hovered ? "#facc15" : "#c7d2fe"}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      {/* TEXT PARTICLES */}
      <points ref={textRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={textPositions}
            count={textPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={hovered ? "#facc15" : "#c7d2fe"}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

function ParticleSphere() {
  const [cameraZ, setCameraZ] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setCameraZ(7.5); // Mobile
      } else if (width < 768) {
        setCameraZ(9); // Small tablet
      } else if (width < 1024) {
        setCameraZ(10); // Tablet
      } else {
        setCameraZ(8); // Desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, cameraZ] }} key={cameraZ}>
      <ambientLight intensity={1.4} />
      <ParticlePoints />
    </Canvas>
  );
}

// HOME
export default function Home({ defaultConfig }) {
  const [heroTitle, setHeroTitle] = useState(defaultConfig?.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(defaultConfig?.hero_subtitle);
  const [ctaText, setCtaText] = useState(defaultConfig?.cta_button);

  // Stats
  const [stats, setStats] = useState({
    jobs: 0,
    internships: 0,
    events: 0,
    users: 0
  });

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

  // Animate stats on load
  useEffect(() => {
    function onConfig(e) {
      const cfg = e.detail || {};
      setHeroTitle(cfg.hero_title || defaultConfig?.hero_title);
      setHeroSubtitle(cfg.hero_subtitle || defaultConfig?.hero_subtitle);
      setCtaText(cfg.cta_button || defaultConfig?.cta_button);
    }

    const animateStats = () => {
      const targetStats = {
        jobs: 200,
        internships: 100,
        events: 56,
        users: 1000
      };

      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setStats({
          jobs: Math.floor(targetStats.jobs * progress),
          internships: Math.floor(targetStats.internships * progress),
          events: Math.floor(targetStats.events * progress),
          users: Math.floor(targetStats.users * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, interval);
    };

    if (isStatsInView) {
      animateStats();
    }

    window.addEventListener('ic-onConfigChange', onConfig);
    return () => {
      window.removeEventListener('ic-onConfigChange', onConfig);
    };
  }, [defaultConfig, isStatsInView]);

  // Particle sphere scroll animation
  const { scrollY } = useScroll();
  const sphereY = useTransform(scrollY, [0, 600], [0, 140]);
  const sphereScale = useTransform(scrollY, [0, 600], [1, 0.92]);

  return (
    <div className="bg-[#020617] text-white overflow-x-hidden font-sans selection:bg-sky-500/30">
      <SEO />

      {/* ================= HERO ================= */}
      <section
        className="
  relative
  flex flex-col
  md:flex-row
  items-center
  justify-start md:justify-center
  pt-20 sm:pt-24 md:pt-28
  pb-8 md:pb-16
  px-4 sm:px-6
  min-h-screen
  overflow-hidden
"
      >
        {/* Background Decorative Auras */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -ml-40 -mb-20 animate-pulse delay-700" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/10 via-black to-black" />

        <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-16 items-center">

          {/* TEXT */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="text-center md:text-left z-10"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tighter"
            >
              Your Career Journey Starts Here
            </motion.h1>

            <motion.h2
              variants={fadeInUp}
              className="mt-2 sm:mt-3 text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-slate-100"
            >
              Launch your Career in
              <span className="block mt-2 text-sky-400 font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <Typewriter
                  words={[
                    "Web Development",
                    "AI Models",
                    "Data Analytics",
                    "Machine Learning",
                    "UI/UX",
                    "Internships & Jobs"
                  ]}
                  loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={60}
                  delaySpeed={1500}
                />
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto md:mx-0 leading-relaxed"
            >
              We provide courses, internships, and AI-powered tools to help you
              enhance your skills and get ready for your dream jobs.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex justify-center md:justify-start"
            >
              <Link
                to="/jobs"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] font-black tracking-widest text-sm text-white"
              >
                <FaSearch size={14} className="group-hover:rotate-12 transition-transform" />
                Explore Opportunities
                <div className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </Link>
            </motion.div>
          </motion.div>

          {/* PARTICLE SPHERE — visible on all screens, no movement on mobile */}
          <motion.div
            style={
              typeof window !== 'undefined' && window.innerWidth >= 768
                ? { y: sphereY, scale: sphereScale }
                : {}
            }
            className="
      relative
      w-full
      mt-5 sm:mt-4 md:mt-0
      h-[180px]
      sm:h-[240px]
      md:h-[320px]
      lg:h-[420px]
      "
          >
            <ParticleSphere />
          </motion.div>


        </div>
      </section>
      <section ref={statsRef} className="py-8 sm:py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {[
            { icon: <FaBriefcase />, value: stats.jobs, label: 'Jobs' },
            { icon: <FaGraduationCap />, value: stats.internships, label: 'Internships' },
            { icon: <FaCalendarAlt />, value: stats.events, label: 'Events' },
            { icon: <FaStar />, value: stats.users, label: 'Users' }
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative bg-[#0c111d]/50 backdrop-blur-xl border border-sky-500/20 rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-8 text-center hover:border-sky-500/30 transition-colors shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-3xl pointer-events-none" />
              <div className="relative text-2xl sm:text-3xl md:text-5xl text-sky-400 mb-2 md:mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">{s.icon}</div>
              <motion.div
                variants={fadeInUp}
                className="relative text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white"
              >
                {s.value}+
              </motion.div>
              <motion.h4
                variants={fadeInUp}
                className="relative text-slate-400 text-[10px] sm:text-xs md:text-sm tracking-[0.2em] mt-1"
              >
                {s.label}
              </motion.h4>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Kick Your Journey With Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Everything you need to launch your career, powered by Internship Catalyst
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: <FaRobot />, title: "Internships", description: "Start your journey & Learn with top MNC Companies.", link: "/internships", linkText: "Explore Interships" },
            { icon: <FaChartLine />, title: "Jobs", description: "All the latest Updates Related to Top MNC's Companies here job and vacancies are here stay connect with us.", link: "/jobs", linkText: "View Jobs" },
            { icon: <FaLaptopCode />, title: "Premium Courses", description: "Upskill with courses designed to make you job-ready.", link: "/courses", linkText: "View Courses" },
            { icon: <FaCalendarAlt />, title: "Events & Hackathons", description: "Stay updated with career fairs, networking events & coding competitions.", link: "/events", linkText: "Explore Events" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative bg-[#0c111d]/40 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-sky-500/20 p-6 sm:p-8 flex flex-col transition-all duration-500 hover:border-sky-500/50 hover:-translate-y-3"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-2xl sm:text-3xl text-sky-400 mb-6 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-500 shadow-inner">{feature.icon}</div>
              <motion.h3 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-sm sm:text-base text-slate-400 flex-grow mb-6 leading-relaxed">{feature.description}</motion.p>
              <Link to={feature.link} className="inline-flex items-center gap-2 text-sm sm:text-base text-sky-400 font-black tracking-wider hover:text-sky-300 transition-colors">
                {feature.linkText} <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Powerful Career Tools</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Everything you need to launch your career, powered by AI</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: <FaRobot />, title: "AI Resume Builder", description: "Create ATS-optimized resumes with AI suggestions.", link: "/ai-resume-templates", linkText: "Build Resume" },
            { icon: <FaChartLine />, title: "ATS Score Checker", description: "Get instant feedback on your resume's ATS compatibility.", link: "/ats-score-checker", linkText: "Check Score" },
            { icon: <FaLaptopCode />, title: "Skill Gap Analyzer", description: "Upskill with courses designed to make you a responsive ChatBot.", link: "/skill-gap-analyzer", linkText: "Skill Analyze" },
            { icon: <FaCalendarAlt />, title: "Cover Letter Generator", description: "Stay updated with career fairs,We stand with you for your bright future.", link: "/cover-letter-ai", linkText: "Cover Letter" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative bg-[#0c111d]/40 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-sky-500/20 p-6 sm:p-8 flex flex-col transition-all duration-500 hover:border-sky-500/50 hover:-translate-y-3"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-2xl sm:text-3xl text-sky-400 mb-6 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
              <motion.h3 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-sm sm:text-base text-slate-400 flex-grow mb-6 leading-relaxed">{feature.description}</motion.p>
              <Link to={feature.link} className="inline-flex items-center gap-2 text-sm sm:text-base text-sky-400 font-black tracking-wider hover:text-sky-300 transition-colors">
                {feature.linkText} <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">How It Works</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Your journey from student to professional in five simple steps</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
        >
          {[
            { step: "01", title: "Create Profile", desc: "Tell us about your skills & goals" },
            { step: "02", title: "Premium Courses", desc: "Our Courses Help you to enhance your Knowledge" },
            { step: "03", title: "Use AI Tools", desc: "Resume builder & ATS checker" },
            { step: "04", title: "Apply Smart", desc: "Jobs, internships & events" },
            { step: "05", title: "Get Hired", desc: "Crack interviews with confidence" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative bg-[#0c111d]/40 border border-sky-500/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 text-center hover:border-sky-500/30 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-400/30 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-500 mb-4">{item.step}</div>
              <motion.h3 variants={fadeInUp} className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-sm text-slate-400 leading-relaxed">{item.desc}</motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Who Is This Platform For?</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Designed for every professional career stage</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {[
            { icon: <FaGraduationCap />, title: "Students", desc: "Explore internships & build skills early" },
            { icon: <FaLaptopCode />, title: "Freshers", desc: "Crack ATS & land your first job" },
            { icon: <FaBriefcase />, title: "Professionals", desc: "Switch careers & grow faster" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#0c111d]/60 to-[#0c111d]/20 border border-sky-500/20 rounded-3xl p-8 sm:p-10 text-center
              hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10 transition-all flex flex-col items-center group duration-500"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl text-sky-400 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                {item.icon}
              </div>
              <motion.h3 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">{item.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.desc}</motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Why Choose Us?</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Built to actually get you hired</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {[
            { icon: <FaRobot />, title: "AI Powered", desc: "Smart resume & career recommendations" },
            { icon: <FaStar />, title: "Verified Opportunities", desc: "No fake jobs, only trusted companies" },
            { icon: <FaBolt />, title: "Faster Growth", desc: "Save time & apply smarter" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-[#0c111d]/40 border border-sky-500/20 rounded-3xl p-8 sm:p-10 text-center
              hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 group"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl text-sky-400 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                {item.icon}
              </div>
              <motion.h3 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-2">{item.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.desc}</motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Client Work Project</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Showcasing our latest successful collaborations</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="bg-[#0c111d]/40 border border-sky-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-20 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
          <motion.h3
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Project Showcase Coming Soon
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            We are currently updating our portfolio with our latest client work. Our team is delivering high-impact solutions for startups and enterprises worldwide. Stay tuned!
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="mt-10 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-sky-500/20 text-sky-400 text-xs font-black tracking-widest"
          >
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            Under Construction
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Our More Sites</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">Explore our specialized services</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
        >
          {/* Digital Marketing */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-gradient-to-br from-[#0c111d]/60 to-[#0c111d]/20 border border-sky-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl text-sky-400 mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <FaBullhorn />
            </div>
            <motion.h3 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 text-center text-white">Digital Marketing</motion.h3>
            <motion.p variants={fadeInUp} className="text-slate-400 text-sm sm:text-base md:text-lg text-center mb-8 leading-relaxed max-w-md mx-auto">
              Boost your brand presence with our expert digital marketing strategies. SEO, SMM, and conversion optimization.
            </motion.p>
            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm sm:text-base text-sky-400 font-black tracking-widest hover:text-sky-300 transition-colors py-2 border-b-2 border-sky-400/20 hover:border-sky-400">
                Visit Site <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Video Editing */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-gradient-to-br from-[#0c111d]/60 to-[#0c111d]/20 border border-sky-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl text-sky-400 mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <FaVideo />
            </div>
            <motion.h3 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 text-center text-white">Video Production</motion.h3>
            <motion.p variants={fadeInUp} className="text-slate-400 text-sm sm:text-base md:text-lg text-center mb-8 leading-relaxed max-w-md mx-auto">
              High-quality video production and cinematic editing services to tell your brand's story effectively.
            </motion.p>
            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm sm:text-base text-sky-400 font-black tracking-widest hover:text-sky-300 transition-colors py-2 border-b-2 border-sky-400/20 hover:border-sky-400">
                Visit Site <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="relative bg-gradient-to-br from-sky-500/10 via-[#0c111d]/80 to-purple-500/5 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] border border-sky-500/20 p-6 sm:p-10 md:p-14 lg:p-20 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-12">
            <div className="lg:w-2/3 text-center lg:text-left">
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-[1.1]"
              >
                Ready to Transform <br className="hidden md:block" /> Your Career?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 sm:mb-10 max-w-2xl leading-relaxed text-center lg:text-left mx-auto lg:mx-0"
              >
                Join thousands of students who've landed their dream jobs through our AI-powered career platform.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/auth" className="bg-sky-500 text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-full font-black tracking-widest text-xs sm:text-sm shadow-[0_10px_30px_rgba(56,189,248,0.3)] hover:bg-sky-400 hover:-translate-y-1 transition-all duration-300 text-center">
                  Get Started Free
                </Link>
                <Link to="/courses" className="bg-white/5 backdrop-blur-sm text-white border border-sky-500/20 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-full font-black tracking-widest text-xs sm:text-sm hover:bg-white/10 transition-all duration-300 text-center">
                  Explore Courses
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="lg:w-1/3 hidden md:flex justify-center"
            >
              <div className="w-full max-w-[320px] aspect-square bg-[#0c111d] rounded-[2.5rem] border border-sky-500/20 shadow-3xl flex items-center justify-center group/card transition-transform duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent group-hover/card:scale-150 transition-transform duration-1000" />
                <div className="text-center relative z-10 p-8">
                  <div className="w-20 h-20 bg-sky-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover/card:scale-110 transition-transform duration-500">
                    <FaStar className="text-4xl text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                  </div>
                  <motion.p variants={fadeInUp} className="text-white font-black tracking-[0.2em] text-sm mb-2">Premium Catalyst</motion.p>
                  <motion.p variants={fadeInUp} className="text-slate-400 text-xs font-medium">Verified by Industry Leaders</motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-8 sm:py-14 md:py-20 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">What Our Users Say</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Real stories from students & professionals worldwide
          </p>
        </motion.div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-max flex-nowrap"
            animate={{ x: [0, '-50%'] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          >
            {[
              {
                name: "Rahul Singh",
                role: "BTech Final Year",
                text: "ATS checker showed exact issues in my resume. Got interview calls in 2 weeks."
              },
              {
                name: "Neha Kapoor",
                role: "MBA Student",
                text: "Career roadmap + internships made my profile very strong."
              },
              {
                name: "Aman Verma",
                role: "Frontend Developer",
                text: "Clean UI, verified jobs & no spam. Loved the experience."
              },
              {
                name: "Sneha Joshi",
                role: "Data Analyst",
                text: "Premium courses helped me switch domain confidently."
              }
            ].concat([
              {
                name: "Rahul Singh",
                role: "BTech Final Year",
                text: "ATS checker showed exact issues in my resume. Got interview calls in 2 weeks."
              },
              {
                name: "Neha Kapoor",
                role: "MBA Student",
                text: "Career roadmap + internships made my profile very strong."
              },
              {
                name: "Aman Verma",
                role: "Frontend Developer",
                text: "Clean UI, verified jobs & no spam. Loved the experience."
              },
              {
                name: "Sneha Joshi",
                role: "Data Analyst",
                text: "Premium courses helped me switch domain confidently."
              }
            ]).map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] bg-[#0c111d]/60 backdrop-blur-xl border border-sky-500/20
                rounded-2xl md:rounded-[2rem] p-6 sm:p-8 hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 group"
              >
                <p className="italic text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">“{t.text}”</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg tracking-tight">{t.name}</h4>
                    <p className="text-sky-400 text-xs sm:text-sm font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= TRUSTED BY COMPANIES ================= */}
      <section className="py-8 sm:py-14 md:py-20 lg:py-32 px-4 sm:px-6 bg-white/[0.02] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Trusted by Hiring Partners
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Students placed & hired across top industry leaders
          </p>
        </motion.div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center w-max flex-nowrap"
            animate={{ x: [0, '-50%'] }}
            transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
          >
            {[
              { name: 'Google', icon: <FaGoogle />, color: 'text-[#4285F4]' },
              { name: 'Amazon', icon: <FaAmazon />, color: 'text-[#FF9900]' },
              { name: 'Microsoft', icon: <FaMicrosoft />, color: 'text-[#00A4EF]' },
              { name: 'Meta', icon: <FaMeta />, color: 'text-[#1877F2]' },
              { name: 'Flipkart', icon: <SiFlipkart />, color: 'text-[#2874F0]' },
              { name: 'Infosys', icon: <SiInfosys />, color: 'text-[#007CC3]' }
            ]
              .concat([
                { name: 'Google', icon: <FaGoogle />, color: 'text-[#4285F4]' },
                { name: 'Amazon', icon: <FaAmazon />, color: 'text-[#FF9900]' },
                { name: 'Microsoft', icon: <FaMicrosoft />, color: 'text-[#00A4EF]' },
                { name: 'Meta', icon: <FaMeta />, color: 'text-[#1877F2]' },
                { name: 'Flipkart', icon: <SiFlipkart />, color: 'text-[#2874F0]' },
                { name: 'Infosys', icon: <SiInfosys />, color: 'text-[#007CC3]' }
              ])
              .map((company, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg md:text-xl font-black whitespace-nowrap
                  transition-all duration-500 hover:scale-110 px-4 sm:px-6 py-4 bg-white/5 rounded-2xl border border-sky-500/20"
                >
                  <span className={`text-2xl sm:text-3xl md:text-4xl ${company.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                    {company.icon}
                  </span>
                  <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl tracking-widest">
                    {company.name}
                  </span>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}