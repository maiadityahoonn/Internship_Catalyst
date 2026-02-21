import React from 'react';
import { Link } from 'react-router-dom';
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
  FaMobile
} from 'react-icons/fa';
import webpageLogo from '../assets/webpage.jpeg';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalContent, setModalContent] = React.useState(null);

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
          <p>For more detailed information, please contact our Data Protection Officer.</p>
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
            <li>Content you post must be accurate and not violate confidental property rights.</li>
            <li>We reserve the right to terminate accounts that violate our community guidelines.</li>
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
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
          </ul>
          <p>You can control cookie settings through your browser preferences.</p>
        </div>
      )
    },
    sitemap: {
      title: "Sitemap",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">Main</h4>
            <ul className="space-y-1 text-sm">
              <li>Home</li>
              <li>About Us</li>
              <li>Job Opportunities</li>
              <li>Events</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li>AI Resume Builder</li>
              <li>ATS Score Checker</li>
              <li>Skill Gap Analyzer</li>
              <li>Cover Letter Generator</li>
            </ul>
          </div>
        </div>
      )
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-grey to-gray-800 pt-20 pb-10 px-4 md:px-6 lg:px-8 border-t border-sky-600/20 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-sky-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* BRAND */}
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <img src={webpageLogo} alt="IC Career Portal Logo" className="w-11 h-11 rounded-xl shadow-lg shadow-sky-500/30 object-cover" />
              <h2 className="text-2xl font-black bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                Internship Catalyst
              </h2>
            </div>

            <p className="text-sky-200 leading-relaxed max-w-sm">
              Connecting exceptional talent with outstanding opportunities.
              Building successful careers, one step at a time.
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-black/40 border border-sky-500/20
                               flex items-center justify-center text-sky-300
                               hover:text-white hover:bg-sky-500/20
                               hover:shadow-lg hover:shadow-sky-500/30
                               transition-all duration-300"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Job Opportunities", "/jobs"],
                ["AI Powered Tools", "/ai"],
                ["Premium Courses", "/courses"],
                ["Events & Hackathons", "/events"]
              ].map(([name, path], i) => (
                <li key={i}>
                  <Link
                    to={path}
                    className="text-sky-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Powered Tools */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              AI Powered Tools
            </h3>
            <ul className="space-y-4">
              {[
                ["AI Resume Builder", "/ai"],
                ["ATS Score Checker", "/ai"],
                ["Skill Gap Analyzer", "/ai"],
                ["Cover Letter Generator", "/ai"],
              ].map(([name, path], i) => (
                <li key={i}>
                  <Link
                    to={path}
                    className="text-sky-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              Contact Us
            </h3>

            <ul className="space-y-5 text-sky-200">
              <li className="flex gap-3 justify-center md:justify-start">
                <FaEnvelope className="text-sky-400 mt-1 shrink-0" />
                <span>contact@internshipcatalyst.com</span>
              </li>
              <li className="flex gap-3 justify-center md:justify-start">
                <FaMobile className="text-sky-400 mt-1 shrink-0" />
                <span>+91 74628 27259</span>
              </li>
              <li className="flex gap-3 justify-center md:justify-start">
                <FaMapMarkerAlt className="text-sky-400 mt-1 shrink-0" />
                <span>Indrapuri, Bhopal, MP-462022</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-sky-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sky-300">
              © {currentYear} Internship Catalyst. All rights reserved.
            </p>
            <p className="text-sky-200/70 text-sm mt-1">
              Empowering careers worldwide <FaHeart className="inline text-red-400 ml-1 animate-pulse" />
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sky-300 text-sm text-center">
            <button onClick={() => openModal(modalData.privacy.title, modalData.privacy.content)} className="hover:text-white hover:underline transition-colors">Privacy Policy</button>
            <button onClick={() => openModal(modalData.terms.title, modalData.terms.content)} className="hover:text-white hover:underline transition-colors">Terms</button>
            <button onClick={() => openModal(modalData.cookies.title, modalData.cookies.content)} className="hover:text-white hover:underline transition-colors">Cookies</button>
            <button onClick={() => openModal(modalData.sitemap.title, modalData.sitemap.content)} className="hover:text-white hover:underline transition-colors">Sitemap</button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-gray-900 border border-sky-500/30 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl shadow-sky-500/20 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">{modalContent.title}</h3>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {modalContent.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
