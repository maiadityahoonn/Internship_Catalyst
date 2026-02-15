import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserPlus, FaArrowRight, FaGoogle, FaCheckCircle, FaStar, FaShieldAlt, FaRocket } from 'react-icons/fa';
import logoimg from "../assets/webpage.jpeg";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!auth) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#050511] px-4 font-sans text-center">
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 max-w-sm w-full shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaShieldAlt className="text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">System Error</h2>
          <p className="text-gray-400 mb-4 text-xs">Please check your setup or connection.</p>
        </div>
      </section>
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent to your email!');
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Welcome Back via Google!');
      navigate('/');
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(error.message);
    }
    setLoading(false);
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
        alert('Welcome Back!');
        navigate('/');
      } else {
        // Signup Logic
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update Profile with Name
        if (name) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
        }

        alert('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please login instead.");
      } else if (error.code === 'auth/weak-password') {
        alert("Password should be at least 6 characters.");
      } else if (error.code === 'auth/invalid-email') {
        alert("Please enter a valid email address.");
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("Invalid email or password.");
      } else if (error.code === 'auth/too-many-requests') {
        alert("Too many attempts! Please wait a few minutes before trying again.");
      } else {
        alert(error.message);
      }
    }

    setLoading(false);
  };

  return (
    // Changed h-screen to min-h-screen for mobile scrolling, lg:h-screen for desktop
    <div className="min-h-screen lg:h-screen bg-[#020617] relative overflow-x-hidden font-sans selection:bg-indigo-500/30 flex flex-col items-center justify-center">

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-40">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(14,165,233,0.3)_0%,transparent_70%)] blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -40, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_60%)] blur-[100px]"
          />
        </div>
        {/* Subtle dot pattern for texture */}
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row max-w-[1400px] mx-auto lg:h-full">

        {/* ================= LEFT SIDE: BRANDING (LARGE) ================= */}
        {/* Added order-last lg:order-first to move branding to right/bottom on mobile if desired, but kept standard stack here. 
            Actually, branding usually comes first. 
            Adjusted padding for mobile (p-6) vs desktop (p-16) 
            Added py-10 for mobile vertical spacing */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 py-12 lg:p-16 overflow-hidden">

          {/* Branding (Single Line) */}
          <div className="flex items-center gap-4 lg:gap-5 mb-8 lg:mb-16 group cursor-pointer w-fit" onClick={() => window.location.href = '/'}>
            <img src={logoimg} className="w-15 h-20 rounded-3xl" alt="Logo" />
            <span className="text-xl lg:text-4xl font-black text-white tracking-tight">Internship <span className="text-sky-400">Catalyst</span></span>
          </div>

          {/* Catchy Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] lg:text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4 lg:mb-6">
              <FaStar className="text-indigo-400" />
              #1 Student Platform
            </div>

            {/* Adjusted Font Sizes for Mobile: text-4xl base, lg:text-7xl */}
            <h1 className="text-4xl lg:text-7xl font-black text-white leading-[1.1] mb-6 lg:mb-8 tracking-tight drop-shadow-2xl">
              Launch Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Dream Career.</span>
            </h1>

            <p className="text-base lg:text-2xl text-slate-300 mb-8 lg:mb-10 font-medium leading-relaxed max-w-xl">
              Connect with top companies and unlock exclusive opportunities tailored for your growth.
            </p>

            <div className="flex items-center gap-8 lg:gap-12">
              <div>
                <p className="text-2xl lg:text-4xl font-black text-white">45k+</p>
                <p className="text-[10px] lg:text-sm text-slate-400 uppercase font-bold tracking-widest mt-1">Seekers</p>
              </div>
              <div className="w-px h-8 lg:h-12 bg-white/20"></div>
              <div>
                <p className="text-2xl lg:text-4xl font-black text-white">98%</p>
                <p className="text-[10px] lg:text-sm text-indigo-400 uppercase font-bold tracking-widest mt-1">Hired</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT SIDE: AUTH FORM (COMPACT) ================= */}
        {/* Adjusted padding for mobile */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 pb-12 lg:pb-0">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px]"
          >
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">

              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-white mb-1">
                  {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back!' : 'Join Us Today')}
                </h2>
                <p className="text-slate-400 text-xs font-medium">
                  {isForgotPassword
                    ? 'Enter your email to receive a reset link.'
                    : (isLogin ? 'Enter your details to access your account.' : 'Start your professional journey now.')}
                </p>
              </div>

              {/* Box Content - Transitions between Login/Register and Forgot Password */}
              <AnimatePresence mode="wait">
                {isForgotPassword ? (
                  /* FORGOT PASSWORD FORM */
                  <motion.form
                    key="forgot-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                  >
                    <div className="relative group/input">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                      <input
                        type="email" placeholder="Email Address"
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-xs outline-none focus:border-indigo-500/50 focus:bg-black/50 transition-all font-medium placeholder:text-slate-600"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-3.5 rounded-xl shadow-lg hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                      >
                        <span className="text-[10px] uppercase tracking-widest">{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full text-center text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors tracking-widest mt-4"
                    >
                      Back to Login
                    </button>
                  </motion.form>
                ) : (
                  /* LOGIN / REGISTER FORM */
                  <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Switcher */}
                    <div className="flex bg-black/20 p-1 rounded-xl mb-6 border border-white/5">
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Register
                      </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      <AnimatePresence mode="wait">
                        {!isLogin && (
                          <motion.div
                            key="name-field"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="relative group/input">
                              <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                              <input
                                type="text" placeholder="Full Name"
                                className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-xs outline-none focus:border-indigo-500/50 focus:bg-black/50 transition-all font-medium placeholder:text-slate-600"
                                value={name} onChange={(e) => setName(e.target.value)} required={!isLogin}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative group/input">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                        <input
                          type="email" placeholder="Email Address"
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-xs outline-none focus:border-indigo-500/50 focus:bg-black/50 transition-all font-medium placeholder:text-slate-600"
                          value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                      </div>

                      <div className="relative group/input">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                        <input
                          type="password" placeholder="Password"
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-xs outline-none focus:border-indigo-500/50 focus:bg-black/50 transition-all font-medium placeholder:text-slate-600"
                          value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                      </div>

                      {/* Forgot Password Link */}
                      {isLogin && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[9px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          disabled={loading}
                          className="w-full bg-white text-black font-black py-3.5 rounded-xl shadow-lg hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                          <span className="text-[10px] uppercase tracking-widest">{loading ? 'Processing...' : (isLogin ? 'Login Access' : 'Create Account')}</span>
                          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/5"></div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Or Continue With</span>
                      <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/5 py-3 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white group"
                    >
                      <FaGoogle className="text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
                    </button>

                    {!isLogin && (
                      <p className="mt-4 text-center text-[9px] text-slate-600 font-medium">By registering, you agree to our Terms & Conditions.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
