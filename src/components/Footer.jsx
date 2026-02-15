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
  FaRocket
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <FaRocket className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                IC Career Portal
              </h2>
            </div>

            <p className="text-sky-200 leading-relaxed">
              Connecting exceptional talent with outstanding opportunities.
              Building successful careers, one step at a time.
            </p>

            <div className="flex gap-4">
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
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                ["Home", "/"],
                ["Job Opportunities", "/jobs"],
                ["Internships", "/internships"],
                ["AI Resume Builder", "/resume-builder"],
                ["ATS Score Checker", "/ats-score"],
                ["Premium Courses", "/courses"],
                ["Events & Hackathons", "/events"]
              ].map(([name, path], i) => (
                <li key={i}>
                  <Link
                    to={path}
                    className="text-sky-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                ["Career Blog", "/blog"],
                ["Interview Prep", "/interview-prep"],
                ["Resume Templates", "/templates"],
                ["Company Reviews", "/reviews"],
                ["Salary Guide", "/salary-guide"],
                ["Success Stories", "/success-stories"],
                ["FAQ & Help", "/help"]
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
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-sky-500/30 inline-block pb-2">
              Contact Us
            </h3>

            <ul className="space-y-5 text-sky-200">
              <li className="flex gap-3">
                <FaEnvelope className="text-sky-400 mt-1" />
                support@iccareer.com
              </li>
              <li className="flex gap-3">
                <FaPhone className="text-sky-400 mt-1" />
                +91 12345 67890
              </li>
              <li className="flex gap-3">
                <FaMapMarkerAlt className="text-sky-400 mt-1" />
                Tech Park, Sector 62, Noida
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-sky-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sky-300">
              © {currentYear} IC Career Portal. All rights reserved.
            </p>
            <p className="text-sky-200/70 text-sm mt-1">
              Empowering careers worldwide <FaHeart className="inline text-red-400 ml-1" />
            </p>
          </div>

          {/* BAdges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-none">
          {[
            "🏆 Trusted by 5000+ Students",
            "⚡ 100% Secure Platform",
            "🌟 4.9/5 User Rating"
          ].map((b, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-full bg-black/40 border border-sky-500/20 text-sky-300 text-sm"
            >
              {b}
            </div>
          ))}
        </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sky-300 text-sm text-center">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
