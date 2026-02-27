import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaRocket,
  FaMobile,
  FaWhatsapp,
  FaChevronUp,
  FaRegPaperPlane
} from 'react-icons/fa';
import webpageLogo from '../assets/webpage.jpeg';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalContent, setModalContent] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const footerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const waveY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (title, content) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const modalData = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>At Internship Catalyst, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We collect information you provide directly to us when you create an account or update your profile.</li>
            <li>We use your information to provide, maintain, and improve our services, including AI-powered job matching.</li>
            <li>We do not sell your personal data to third parties.</li>
            <li>You have the right to access, correct, or delete your personal information at any time.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>By accessing or using Internship Catalyst, you agree to be bound by these Terms of Service.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must differ to all applicable laws and regulations while using our platform.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>Content you post must be accurate and not violate property rights.</li>
          </ul>
        </div>
      )
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>We use cookies and similar technologies to enhance your experience on our platform.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand interaction.</li>
          </ul>
        </div>
      )
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail('');
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#020617] pt-16 sm:pt-24 lg:pt-32 pb-12 px-4 sm:px-6 lg:px-12 border-t border-white/5 overflow-hidden"
    >

      {/* Dynamic Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <motion.svg
          style={{ y: waveY }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[200%] h-[100px] fill-white/[0.02]"
        >
          <path d="M321.39,56.44c12.2,2.44,24.41,4.88,36.62,7.32c12.2,2.44,24.41,4.88,36.62,2.44c12.2,-2.44,24.41,-7.32,36.62,-12.2c12.2,-4.88,24.41,-7.32,36.62,-4.88c12.2,2.44,24.41,7.32,36.62,12.2c12.2,4.88,24.41,7.32,36.62,4.88c12.2,-2.44,24.41,-7.32,36.62,-12.2c12.2,-4.88,24.41,-7.32,36.62,-4.88c12.2,2.44,24.41,7.32,36.62,12.2c12.2,4.88,24.41,7.32,36.62,4.88c12.2,-2.44,24.41,-7.32,36.62,-12.2V120H0V0C31.54,0,63.09,14.63,94.63,29.27c31.54,14.63,63.09,29.27,94.63,29.27c31.54,0,63.09,-14.63,94.63,-29.27c31.54,-14.63,63.09,-29.27,94.63,-29.27Z"></path>
        </motion.svg>
      </div>

      {/* Liquid Aura Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 contrast-150 brightness-50"></div>

        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-blue-600/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[90%] bg-indigo-600/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">

        {/* Newsletter Section with Border Beam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 mb-12 sm:mb-20 md:mb-24 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-sm font-bold tracking-widest">
                Stay Ahead
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Potential</span>
              </h3>
              <p className="text-sky-100/60 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0">
                Subscribe to our newsletter for exclusive internship alerts and AI tips.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-[45%] flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 group/input">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium text-sm"
                />
                <div className="absolute inset-0 rounded-2xl bg-sky-500/5 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black font-black px-6 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all flex items-center justify-center gap-3 whitespace-nowrap text-sm"
              >
                Get Started <FaRegPaperPlane className="text-lg" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-10 sm:gap-y-14 lg:gap-x-12 mb-12 sm:mb-16 md:mb-24">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-6 sm:space-y-8 lg:space-y-10">
            <Link to="/" className="inline-flex items-center gap-2 sm:gap-2 md:gap-2 group">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "backOut" }}
                  className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl md:rounded-[1.25rem] bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px]"
                >
                  <div className="w-full h-full rounded-[1.2rem] bg-[#000000] flex items-center justify-center overflow-hidden">
                    <img src={webpageLogo} alt="Logo" className="w-full h-full object-cover scale-110" />
                  </div>
                </motion.div>
                <div className="absolute inset-0 blur-2xl bg-sky-500/30 -z-10 group-hover:bg-sky-500/50 transition-colors"></div>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white whitespace-nowrap">
                Internship <span className="relative inline-block text-sky-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-sky-400 after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left">Catalyst</span>
              </h2>
            </Link>

            <p className="text-sky-100/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              Internship Catalyst offers verified jobs, internships, professional skill courses, and AI-powered career tools to help students grow and get hired faster today.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-5">
              {[
                { Icon: FaInstagram, color: '#E4405F', link: '#' },
                { Icon: FaLinkedinIn, color: '#0A66C2', link: '#' },
                { Icon: FaTwitter, color: '#1DA1F2', link: '#' },
                { Icon: FaWhatsapp, color: '#25D366', link: '#' },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.link}
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/50 text-lg sm:text-xl md:text-2xl hover:text-white transition-colors relative group/icon overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[var(--hover-color)] opacity-0 group-hover/icon:opacity-100 transition-opacity" style={{ "--hover-color": item.color }}></div>
                  <item.Icon className="relative z-10" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <h4 className="text-white font-black tracking-[0.2em] text-xs">Explore</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Jobs", "Internships", "Courses", "Events"].map((name) => (
                <li key={name}>
                  <Link
                    to={name === "Home" ? "/" : `/${name.toLowerCase().replace(' ', '-')}`}
                    className="text-sky-100/50 hover:text-white transition-all font-bold text-base sm:text-lg inline-block group"
                  >
                    <span className="relative">
                      {name}
                      <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <h4 className="text-white font-black tracking-[0.2em] text-xs">Tools</h4>
            <ul className="space-y-4">
              {["AI Resume", "ATS Checker", "Skill Gap", "Cover Letter"].map((name) => (
                <li key={name}>
                  <Link to="#" className="text-sky-100/50 hover:text-white transition-all font-bold text-base sm:text-lg inline-block group">
                    <span className="relative">
                      {name}
                      <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.03] border border-white/5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full"></div>
              <h4 className="text-white font-black tracking-[0.2em] text-xs mb-8">Direct Access</h4>
              <div className="space-y-6">
                <a href="mailto:contact@internshipcatalyst.com" className="flex items-center gap-4 group/contact">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover/contact:bg-sky-500 group-hover/contact:text-white transition-all">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="block text-white font-bold group-hover/contact:text-sky-400 transition-colors">Email</span>
                    <span className="text-xs text-sky-100/40 font-medium">Click to compose</span>
                  </div>
                </a>
                <a href="tel:+917462827259" className="flex items-center gap-4 group/contact">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover/contact:bg-indigo-500 group-hover/contact:text-white transition-all">
                    <FaMobile />
                  </div>
                  <div>
                    <span className="block text-white font-bold group-hover/contact:text-indigo-400 transition-colors">WhatsApp</span>
                    <span className="text-xs text-sky-100/40 font-medium">+91 74628 27259</span>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="block text-white font-bold">HQ Office</span>
                    <span className="text-xs text-sky-100/40 font-medium">Bhopal, MP, India</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Bottom Bar */}
        <div className="pt-8 sm:pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 md:gap-10">
            <div className="text-center sm:text-left">
              <p className="text-sky-100/30 text-sm font-medium tracking-tight">
                © {currentYear} Internship Catalyst. Finalized with <FaHeart className="inline text-red-500/50 mx-1" />
              </p>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-6">
              <button onClick={() => openModal(modalData.privacy.title, modalData.privacy.content)} className="text-sky-100/40 hover:text-white text-xs font-bold tracking-widest transition-colors">Privacy</button>
              <button onClick={() => openModal(modalData.terms.title, modalData.terms.content)} className="text-sky-100/40 hover:text-white text-xs font-bold tracking-widest transition-colors">Terms</button>
              <button onClick={() => openModal(modalData.cookies.title, modalData.cookies.content)} className="text-sky-100/40 hover:text-white text-xs font-bold tracking-widest transition-colors">Cookies</button>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-black text-white/50 tracking-widest">System Operational</span>
          </div>
        </div>
      </div>

      {/* Futuristic Scroll Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-[100] w-12 h-12 sm:w-16 sm:h-16 bg-white text-black rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-500/20 group cursor-pointer"
          >
            <FaChevronUp className="text-xl group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#050b18] border border-white/10 rounded-[3rem] w-full max-w-2xl p-10 md:p-16 relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <button
                onClick={closeModal}
                className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                ✕
              </button>

              <h3 className="text-4xl font-black text-white mb-8">
                {modalContent.title}
              </h3>

              <div className="max-h-[50vh] overflow-y-auto pr-6 custom-scrollbar text-sky-100/60 leading-relaxed font-medium">
                {modalContent.content}
              </div>

              <div className="mt-12">
                <button
                  onClick={closeModal}
                  className="w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-sky-500/20"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(14, 165, 233, 0.4);
        }
      `}</style>
    </footer>
  );
}
