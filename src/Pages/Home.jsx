import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  FaFacebook,
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
          opacity={0.6}   // dim like sphere
          depthWrite={false}
        />
      </points>
    </group>
  );
}
function ParticleSphere() {
  const [cameraZ, setCameraZ] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setCameraZ(7.5); // Much closer/larger for mobile
      } else if (width < 800) {
        setCameraZ(11);
      } else {
        setCameraZ(8);
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

    const timer = setTimeout(animateStats, 500);

    window.addEventListener('ic-onConfigChange', onConfig);
    return () => {
      window.removeEventListener('ic-onConfigChange', onConfig);
      clearTimeout(timer);
    };
  }, [defaultConfig]);

  // Particle sphere scroll animation
  const { scrollY } = useScroll();
  const sphereY = useTransform(scrollY, [0, 600], [0, 140]);
  const sphereScale = useTransform(scrollY, [0, 600], [1, 0.92]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden font-sans">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-black to-black" />

        <div className="relative max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center lg:text-left z-10 w-full"
          >
            <h1 className="text-[1.75rem] xs:text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-white via-sky-300 to-white bg-clip-text text-transparent mb-6 pb-2 px-2">
              Your Career Journey Starts Here
            </h1>

            <h2 className="mt-4 text-lg xs:text-xl sm:text-2xl lg:text-4xl font-bold leading-snug text-white">
              Launch your Career in
              <span className="block mt-1 text-sky-400 font-extrabold">
                <Typewriter
                  words={[
                    "Web Development",
                    "AI Models",
                    "Data Analyst",
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
            </h2>

            <p className="mt-6 text-sm sm:text-base lg:text-lg text-sky-200 max-w-xl mx-auto lg:mx-0 px-4 sm:px-0 opacity-80">
              We provide courses, internships, and AI-powered tools to help you
              enhance your skills and get ready for your dream jobs.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-400 transition shadow-[0_0_20px_rgba(14,165,233,0.3)] font-bold uppercase tracking-widest text-xs"
              >
                <FaSearch size={14} />
                Explore Opportunities
              </Link>
            </div>
          </motion.div>

          {/* PARTICLE SPHERE */}
          <motion.div
            style={{
              y: window.innerWidth < 768 ? 0 : sphereY,
              scale: sphereScale
            }}
            className="relative w-full h-[300px] md:h-[500px] lg:mt-0"
          >
            <ParticleSphere />
          </motion.div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-12 md:py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: <FaBriefcase />, value: stats.jobs, label: 'Jobs' },
            { icon: <FaGraduationCap />, value: stats.internships, label: 'Internships' },
            { icon: <FaCalendarAlt />, value: stats.events, label: 'Events' },
            { icon: <FaStar />, value: stats.users, label: 'Users' }
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/30 backdrop-blur-md border border-sky-500/20 rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl text-sky-400 mb-2 flex justify-center">{s.icon}</div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black">{s.value}+</div>
              <div className="text-sky-200/70 text-[10px] sm:text-sm md:text-base uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* COURSES & EVENTS OR HACKTHON */}

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase tracking-tight">Kick Your Journey With Us</h2>
          <p className="text-sm sm:text-xl text-sky-200/60 max-w-2xl mx-auto">Everything you need to launch your career, powered by IC</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaRobot />, title: "Internships", description: "Start your journey & Learn with top MNC Companies.", link: "/Internships", linkText: "Interships" },
            { icon: <FaChartLine />, title: "Jobs", description: "All the latest Updates Related to Top MNC's Companies here job and vacancies are here stay connect with us.", link: "/jobs", linkText: "View Jobs" },
            { icon: <FaLaptopCode />, title: "Premium Courses", description: "Upskill with courses designed to make you job-ready.", link: "/courses", linkText: "View Courses" },
            { icon: <FaCalendarAlt />, title: "Events & Hackathons", description: "Stay updated with career fairs, networking events & coding competitions.", link: "/events", linkText: "Explore Events" }
          ].map((feature, i) => (
            <div key={i} className="group bg-black/30 backdrop-blur-lg rounded-2xl border border-sky-500/20 p-6 flex flex-col transition-all duration-300 hover:bg-black/40 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl text-sky-300 mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sky-200 flex-grow mb-5">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center gap-2 text-sky-300 font-semibold hover:text-sky-200 transition-colors duration-300">
                {feature.linkText} <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-4">Powerful Career Tools</h2>
          <p className="text-xl text-sky-200 max-w-2xl mx-auto">Everything you need to launch your career, powered by AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaRobot />, title: "AI Resume Builder", description: "Create ATS-optimized resumes with AI suggestions.", link: "/ai", linkText: "Build Resume" },
            { icon: <FaChartLine />, title: "ATS Score Checker", description: "Get instant feedback on your resume's ATS compatibility.", link: "/ai", linkText: "Check Score" },
            { icon: <FaLaptopCode />, title: "Skill Gap Analyzer", description: "Upskill with courses designed to make you a responsive ChatBot.", link: "/ai", linkText: "Skill Analyze" },
            { icon: <FaCalendarAlt />, title: "Cover Letter Generator", description: "Stay updated with career fairs,We stand with you for your bright future.", link: "/ai", linkText: "Cover Letter" }
          ].map((feature, i) => (
            <div key={i} className="group bg-black/30 backdrop-blur-lg rounded-2xl border border-sky-500/20 p-6 flex flex-col transition-all duration-300 hover:bg-black/40 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl text-sky-300 mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sky-200 flex-grow mb-5">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center gap-2 text-sky-300 font-semibold hover:text-sky-200 transition-colors duration-300">
                {feature.linkText} <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">How It Works</h2>
          <p className="text-sky-200 text-lg">Your journey from student to professional</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {[
            { step: "01", title: "Create Profile", desc: "Tell us about your skills & goals" },
            { step: "02", title: "Premium Courses", desc: "Our Courses Help you to enhance your Knowledge" },
            { step: "03", title: "Use AI Tools", desc: "Resume builder & ATS checker" },
            { step: "04", title: "Apply Smart", desc: "Jobs, internships & events" },
            { step: "05", title: "Get Hired", desc: "Crack interviews with confidence" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-black/30 border border-sky-500/20 rounded-2xl p-6 text-center
              hover:-translate-y-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all"
            >
              <div className="text-4xl md:text-5xl font-black text-sky-400 mb-4">{item.step}</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sky-200 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHO IS THIS FOR ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tight">Who Is This Platform For?</h2>
          <p className="text-sm sm:text-lg text-sky-200/60">Designed for every career stage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FaGraduationCap />, title: "Students", desc: "Explore internships & build skills early" },
            { icon: <FaLaptopCode />, title: "Freshers", desc: "Crack ATS & land your first job" },
            { icon: <FaBriefcase />, title: "Professionals", desc: "Switch careers & grow faster" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gradient-to-br from-black/40 to-black/20 border border-sky-500/20 rounded-2xl p-8 text-center
              hover:shadow-xl hover:shadow-sky-500/20 transition-all flex flex-col items-center"
            >
              <div className="text-4xl text-sky-400 mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-sky-200/70 text-sm sm:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Why Choose Us?</h2>
          <p className="text-sky-200 text-lg">Built to actually get you hired</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaRobot />, title: "AI Powered", desc: "Smart resume & career recommendations" },
            { icon: <FaStar />, title: "Verified Opportunities", desc: "No fake jobs, only trusted companies" },
            { icon: <FaBolt />, title: "Faster Growth", desc: "Save time & apply smarter" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-black/30 border border-sky-500/20 rounded-2xl p-8 text-center
              hover:-translate-y-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all"
            >
              <div className="text-4xl text-sky-400 mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sky-200">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CLIENT WORK PROJECT ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Client Work Project</h2>
          <p className="text-sky-200 text-lg">Showcasing our latest successful collaborations</p>
        </div>

        <div className="bg-black/30 border border-sky-500/20 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Project Showcase Coming Soon</h3>
          <p className="text-sky-200">We are currently updating our portfolio with our latest client work. Stay tuned!</p>
        </div>
      </section>

      {/* ================= OUR MORE SITES ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Our More Sites</h2>
          <p className="text-sky-200 text-lg">Explore our specialized services</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Digital Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group bg-gradient-to-br from-black/40 to-black/20 border border-sky-500/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-sky-500/20 transition-all"
          >
            <div className="text-5xl text-sky-400 mb-6 flex justify-center group-hover:scale-110 transition-transform">
              <FaBullhorn />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Digital Marketing</h3>
            <p className="text-sky-200 text-center mb-6">
              Boost your brand presence with our expert digital marketing strategies. SEO, SMM, and more.
            </p>
            <div className="text-center">
              <Link to="/digital-marketing" className="inline-flex items-center gap-2 text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                Visit Site <FaArrowRight />
              </Link>
            </div>
          </motion.div>

          {/* Video Editing */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group bg-gradient-to-br from-black/40 to-black/20 border border-sky-500/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-sky-500/20 transition-all"
          >
            <div className="text-5xl text-sky-400 mb-6 flex justify-center group-hover:scale-110 transition-transform">
              <FaVideo />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Video Editing & Marketing</h3>
            <p className="text-sky-200 text-center mb-6">
              High-quality video production and editing services to tell your brand's story effectively.
            </p>
            <div className="text-center">
              <Link to="/video-editing" className="inline-flex items-center gap-2 text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                Visit Site <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-sky-500/10 via-black/30 to-gray-900/20 backdrop-blur-xl rounded-3xl border border-sky-500/20 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center">
          <div className="lg:w-2/3 lg:pr-12 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-sky-200 mb-8 max-w-2xl">Join thousands of students who've landed their dream jobs through our platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth" className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-400 hover:to-sky-500 text-center w-full sm:w-auto">
                Get Started Free
              </Link>
              <Link to="/courses" className="bg-black/40 backdrop-blur-sm text-white border-2 border-sky-500/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-black/50 hover:border-sky-500/50 transition-all duration-300 text-center w-full sm:w-auto">
                Explore Premium Courses
              </Link>
            </div>
          </div>
          <div className="lg:w-1/3 mt-12 lg:mt-0 flex justify-center">
            <div className="w-64 h-48 md:w-80 md:h-60 bg-gradient-to-br from-sky-500/20 to-black/40 rounded-2xl border border-sky-500/20 shadow-xl flex items-center justify-center">
              <div className="text-center">
                <FaStar className="text-5xl text-sky-400/70 mx-auto mb-4" />
                <p className="text-sky-200 font-semibold">Premium Career Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">What Our Users Say</h2>
          <p className="text-sky-200 text-lg">
            Real stories from students & professionals
          </p>
        </div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-8 w-max flex-nowrap"
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
              <div
                key={i}
                className="w-[320px] bg-black/30 backdrop-blur-lg border border-sky-500/20
                rounded-2xl p-6 hover:shadow-xl hover:shadow-sky-500/20 transition-all"
              >
                <p className="italic text-sky-100 mb-4">“{t.text}”</p>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-sky-400 text-sm">{t.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= TRUSTED BY COMPANIES ================= */}
      <section className="py-20 px-6 bg-black/30 overflow-hidden pb-30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">
            Trusted by Hiring Partners
          </h2>
          <p className="text-sky-200">
            Students placed & hired across top companies
          </p>
        </div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-24 items-center w-max flex-nowrap"
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
                <div
                  key={i}
                  className="flex items-center gap-3 text-xl font-semibold whitespace-nowrap
                  transition-all duration-300 hover:scale-110 px-4"
                >
                  <span className={`text-3xl ${company.color}`}>
                    {company.icon}
                  </span>
                  <span className="text-sky-100">
                    {company.name}
                  </span>
                </div>
              ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
