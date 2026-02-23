import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaLaptopCode,
  FaRocket,
  FaSignOutAlt,
  FaUserCircle,
  FaUserPlus,
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* 1. Logo Section (Left) */}
          <div className="flex items-center flex-shrink-0 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px]">
            <img
              src={logoimg}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl shadow-lg shadow-sky-500/10 hover:scale-110 transition-transform duration-500 flex-shrink-0"
              alt="Logo"
            />
            <div className="ml-1.5 sm:ml-2 md:ml-3 truncate">
              <span className="text-xs sm:text-sm md:text-base lg:text-xl text-white font-bold tracking-tight">
                Internship <span className="text-sky-400">Catalyst</span>
              </span>
            </div>
          </div>

          {/* 2. Desktop Navigation (Center) - Extra space for Home */}
          <div className="hidden md:flex items-center justify-center flex-1 px-2 lg:px-4">
            <div className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
              {navItems.map((item, index) => {
                const isActive = item.name === "AI" ? isAiActive : location.pathname === item.path;
                const isHome = item.name === "Home";
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-xs lg:text-[13px] font-bold ${isHome ? 'px-4 lg:px-5' : 'px-2 lg:px-3 xl:px-4'
                      } py-1.5 lg:py-2 rounded-xl transition-all duration-300 flex items-center gap-1 lg:gap-2 whitespace-nowrap ${isActive
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
          </div>

          {/* 3. Auth Section & Mobile Toggle (Right) */}
          <div className="flex items-center justify-end flex-shrink-0 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] gap-1 sm:gap-2">
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {!user ? (
                <Link
                  to="/auth"
                  onMouseEnter={() => setIsAuthHovered(true)}
                  onMouseLeave={() => setIsAuthHovered(false)}
                  className="relative group"
                >
                  <div className="relative flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-sky-500/50 text-white transition-all duration-300 whitespace-nowrap">
                    <span className="text-xs lg:text-[13px] font-black uppercase tracking-wider">
                      <span className="hidden xl:inline">Sign Up / Login</span>
                      <span className="xl:hidden">Login</span>
                    </span>
                    <div className="flex items-center">
                      {isAuthHovered ? (
                        <FaUserPlus className="text-sky-400 animate-in fade-in zoom-in duration-300 text-xs lg:text-sm" />
                      ) : (
                        <FaRocket className="text-slate-400 group-hover:text-sky-400 transition-colors text-xs lg:text-sm" />
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/profile')}
                    className="flex items-center gap-1 p-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-white hover:bg-sky-500/20 transition-all group"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="w-6 h-6 lg:w-7 lg:h-8 rounded-full border border-sky-500 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <FaUserCircle className="text-xl lg:text-2xl text-sky-400 group-hover:scale-105 transition-transform" />
                    )}
                    <span className="hidden lg:inline text-xs text-white max-w-[60px] truncate">
                      {user.displayName?.split(' ')[0] || "User"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-white text-xl hover:text-sky-400 transition-colors"
              onClick={() => setMenuActive(!menuActive)}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 sm:w-6 sm:h-5">
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuActive ? 'top-1.5 sm:top-2 rotate-45' : 'top-0'
                  }`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 top-1.5 sm:top-2 ${menuActive ? 'opacity-0 scale-0' : 'opacity-100'
                  }`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${menuActive ? 'top-1.5 sm:top-2 -rotate-45' : 'top-3 sm:top-4'
                  }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuActive && (
        <div className="md:hidden bg-black/95 border-t border-sky-500/20 px-4 py-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.name === "AI" ? isAiActive : location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuActive(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                  : "text-sky-200 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Mobile Account Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            {!user ? (
              <Link
                to="/auth"
                onClick={() => setMenuActive(false)}
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-white"
              >
                <div className="flex items-center gap-3">
                  <FaRocket className="text-sky-400 text-lg" />
                  <span className="text-sm font-black uppercase tracking-wider">Join / Login</span>
                </div>
                <FaUserPlus className="text-sky-400 text-lg" />
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                  onClick={() => setMenuActive(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-full border border-sky-500 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-sky-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate">
                      {user.displayName || user.email?.split('@')[0] || "Explorer"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </Link>

                {user.email === 'admin@internshipcatalyst.com' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMenuActive(false)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sky-400 hover:bg-sky-500/10 font-bold transition-all"
                  >
                    <FaRocket size={14} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition-all"
                >
                  <FaSignOutAlt size={14} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}