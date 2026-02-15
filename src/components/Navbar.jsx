import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaLaptopCode,
  FaUser,
  FaBars,
  FaTimes,
  FaRocket,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";
import logoimg from "../assets/webpage.jpeg";
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar({ siteTitle }) {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setMenuActive(false);
    setIsProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Jobs", path: "/jobs", icon: <FaBriefcase /> },
    { name: "Internships", path: "/internships", icon: <FaGraduationCap /> },
    { name: "Events", path: "/events", icon: <FaCalendarAlt /> },
    { name: "Courses", path: "/courses", icon: <FaLaptopCode /> },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-black/80 backdrop-blur-xl border-b border-sky-500/20"
        : "bg-black/60 backdrop-blur-lg"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logoimg} className="w-10 h-10 rounded-xl" alt="Logo" />
            <div>
              <div className="text-lg font-bold text-white">
                {/* {siteTitle || "IC Portal"} */}
              </div>
              <div className="text-x text-white font-bold">Internship <span className="text-sky-400">Catalyst</span></div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${location.pathname === item.path
                  ? "bg-sky-500/20 text-white border border-sky-500/30"
                  : "text-sky-200 hover:text-white hover:bg-black/40"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* AI Resume Builder Dropdown */}
            <div className="relative group">
              <button
                className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
              >
                <FaRocket className="text-xs" />
                <span>AI Resume Builder</span>
                <FaChevronDown className="text-xs ml-1 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-sky-500/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right overflow-hidden z-50">
                <div className="p-2 space-y-1">
                  <Link to="/ai-cv-builder" className="block px-4 py-3 rounded-lg hover:bg-sky-500/20 text-sky-100 hover:text-white transition-colors">
                    <div className="font-semibold text-sm">AI CV Builder</div>
                    <div className="text-xs text-sky-400/70">Create ATS-friendly resumes</div>
                  </Link>
                  <Link to="/ats-score-checker" className="block px-4 py-3 rounded-lg hover:bg-sky-500/20 text-sky-100 hover:text-white transition-colors">
                    <div className="font-semibold text-sm">AI ATS Score Checker</div>
                    <div className="text-xs text-sky-400/70">Check your resume score</div>
                  </Link>
                  <Link to="/skill-gap-analyzer" className="block px-4 py-3 rounded-lg hover:bg-sky-500/20 text-sky-100 hover:text-white transition-colors">
                    <div className="font-semibold text-sm">AI Skill Gap Analyzer</div>
                    <div className="text-xs text-sky-400/70">Analyze missing skills</div>
                  </Link>
                  <Link to="/cover-letter-ai" className="block px-4 py-3 rounded-lg hover:bg-sky-500/20 text-sky-100 hover:text-white transition-colors">
                    <div className="font-semibold text-sm">AI Cover Letter Generator</div>
                    <div className="text-xs text-sky-400/70">Generate custom cover letters</div>
                  </Link>

                </div>
              </div>
            </div>

            {/* Sign Up / Login (Only if NOT logged in) - MOVED TO LAST */}
            {!user && (
              <Link
                to="/auth"
                className={`ml-2 flex items-center gap-2 px-4 py-2 rounded-lg transition ${location.pathname === "/auth"
                  ? "bg-sky-500/20 text-white border border-sky-500/30"
                  : "text-sky-200 hover:text-white hover:bg-black/40"
                  }`}
              >
                <FaUser />
                Sign Up/Login
              </Link>
            )}

            {/* Profile Dropdown (Only if User is Logged In) */}
            {user && (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-white hover:bg-sky-500/20 transition-all"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-sky-500" />
                  ) : (
                    <FaUserCircle className="text-2xl text-sky-400" />
                  )}
                  {/* <span className="text-sm font-semibold max-w-[100px] truncate">{user.displayName || user.email}</span> */}
                  <FaChevronDown className={`text-xs transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-sky-500/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-bold text-white truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 rounded-lg transition-colors text-sm font-semibold"
                      >
                        <FaRocket /> Admin Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-semibold"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-white"
            onClick={() => setMenuActive(!menuActive)}
          >
            {menuActive ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuActive && (
        <div className="md:hidden bg-black/95 border-t border-sky-500/20 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuActive(false)}
              className="flex items-center gap-3 py-3 text-sky-200 hover:text-white"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <Link
            to="/ai-cv-builder"
            onClick={() => setMenuActive(false)}
            className="mt-4 flex items-center justify-center gap-2 bg-sky-600 py-3 rounded-lg text-white font-semibold shadow-lg shadow-sky-500/20"
          >
            <FaRocket /> AI Resume Builder
          </Link>

          {/* Mobile User Profile Section */}
          {user ? (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 mb-4 px-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border border-sky-500" />
                ) : (
                  <FaUserCircle className="text-3xl text-sky-400" />
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user.displayName || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuActive(false)}
                className="w-full flex items-center gap-3 px-3 py-3 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors mb-2"
              >
                <FaRocket /> Admin Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuActive(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuActive(false)}
              className="mt-4 flex items-center gap-3 py-3 text-sky-200 hover:text-white border-t border-white/10"
            >
              <FaUser />
              Sign Up/Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
