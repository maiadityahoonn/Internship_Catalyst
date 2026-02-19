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
  FaSignOutAlt,
  FaUserCircle,
  FaUserPlus,
  FaChevronDown
} from "react-icons/fa";
import logoimg from "../assets/webpage.jpeg";
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar({ siteTitle }) {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthHovered, setIsAuthHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...currentUser, role: userData.role });
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
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
    { name: "AI", path: "/ai", icon: <FaRocket /> },
  ];

  const aiPaths = ["/ai", "/ai-cv-builder", "/ats-score-checker", "/skill-gap-analyzer", "/cover-letter-ai", "/ai-resume-templates"];
  const isAiActive = aiPaths.includes(location.pathname);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-black/80 backdrop-blur-xl border-b border-sky-500/20"
        : "bg-black/60 backdrop-blur-lg"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. Logo Section (Left) */}
          <div className="flex-1 flex items-center justify-start">
            {/* <Link to="/" className="flex items-center space-x-3 group"> */}
              <img src={logoimg} className="w-10 h-10 rounded-xl shadow-lg shadow-sky-500/10 group-hover:scale-110 transition-transform duration-500" alt="Logo" />
              <div className="text-base sm:text-lg md:text-xl text-white font-bold tracking-tight whitespace-nowrap">
                Internship <span className="text-sky-400">Catalyst</span>
              </div>
            {/* </Link> */}
          </div>

          {/* 2. Desktop Navigation (Center) */}
          <div className="hidden md:flex flex-[2] items-center justify-center space-x-0.5">
            {navItems.map((item) => {
              const isActive = item.name === "AI" ? isAiActive : location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[13px] font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${isActive
                    ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* 3. Auth Section & Mobile Toggle (Right) */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <Link
                  to="/auth"
                  onMouseEnter={() => setIsAuthHovered(true)}
                  onMouseLeave={() => setIsAuthHovered(false)}
                  className="relative group"
                >
                  <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-sky-500/50 text-white transition-all duration-300">
                    <span className="text-[13px] font-black uppercase tracking-wider">Sign Up / Login</span>
                    <div className="flex items-center gap-2">
                      {isAuthHovered ? (
                        <FaUserPlus className="text-sky-400 animate-in fade-in zoom-in duration-300" />
                      ) : (
                        <FaRocket className="text-slate-400 group-hover:text-sky-400 transition-colors" />
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/profile')}
                    className="flex items-center gap-2 p-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-white hover:bg-sky-500/20 transition-all group"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-sky-500 group-hover:scale-105 transition-transform" />
                    ) : (
                      <FaUserCircle className="text-2xl text-sky-400 group-hover:scale-105 transition-transform" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-white text-2xl hover:text-sky-400 transition-colors"
              onClick={() => setMenuActive(!menuActive)}
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuActive ? 'top-2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 top-2 ${menuActive ? 'opacity-0 scale-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuActive ? 'top-2 -rotate-45' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuActive && (
        <div className="md:hidden bg-black/95 border-t border-sky-500/20 px-4 py-4 max-h-[80vh] overflow-y-auto">
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

          {/* Mobile Account Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            {!user ? (
              <Link
                to="/auth"
                onClick={() => setMenuActive(false)}
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-white"
              >
                <div className="flex items-center gap-3">
                  <FaRocket className="text-sky-400" />
                  <span className="text-sm font-black uppercase tracking-wider">Join / Login</span>
                </div>
                <FaUserPlus className="text-sky-400" />
              </Link>
            ) : (
              <div className="space-y-1">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                  onClick={() => setMenuActive(false)}
                  className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-2xl border border-white/10"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border border-sky-500" />
                  ) : (
                    <FaUserCircle className="text-3xl text-sky-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate">{user.displayName || "Explorer"}</p>
                    <p className="text-[10px] text-slate-400 truncate tracking-wide">{user.email}</p>
                  </div>
                </Link>

                {user.email === 'admin@internshipcatalyst.com' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMenuActive(false)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sky-400 hover:bg-sky-500/10 font-bold transition-all"
                  >
                    <FaRocket size={14} /> Dashboard
                  </Link>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
