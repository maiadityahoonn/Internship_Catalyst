import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaEnvelope, FaBriefcase, FaGraduationCap,
    FaCalendarAlt, FaSignOutAlt, FaRocket, FaClock,
    FaMapPin, FaExternalLinkAlt, FaChevronRight, FaEdit, FaCheck, FaTimes,
    FaBrain, FaHistory, FaCreditCard, FaLock, FaUnlock, FaShieldAlt
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { getDirectDriveLink } from '../utils/imageUtils';
import { getPurchaseHistory } from '../utils/aiMonetization';
import { isToolPurchased, PRICING } from '../utils/aiMonetization';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 },
    },
};

export default function Profile() {
    const [user, setUser] = useState(null);
    const [interactions, setInteractions] = useState([]);
    const [aiHistory, setAiHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const navigate = useNavigate();

    // State for SkillGapAnalyzer gate
    const [isSkillGapLocked, setIsSkillGapLocked] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/auth');
            } else {
                setUser(currentUser);
                setNewName(currentUser.displayName || '');

                const q = query(
                    collection(db, 'user_interactions'),
                    where('userId', '==', currentUser.uid)
                );

                const fetchAIData = async () => {
                    const history = await getPurchaseHistory(currentUser.uid);
                    setAiHistory(history);

                    const locked = await isToolPurchased(currentUser.uid, 'skill-gap');
                    setIsSkillGapLocked(!locked);
                };
                fetchAIData();

                const unsubscribeInteractions = onSnapshot(q, (snapshot) => {
                    const docs = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })).sort((a, b) => {
                        const timeA = a.timestamp?.toMillis() || Date.now();
                        const timeB = b.timestamp?.toMillis() || Date.now();
                        return timeB - timeA;
                    });
                    setInteractions(docs);
                    setLoading(false);
                }, (err) => {
                    console.error("Error fetching interactions:", err);
                    setLoading(false);
                });

                return () => unsubscribeInteractions();
            }
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === user.displayName) {
            setIsEditingName(false);
            return;
        }

        setIsSavingName(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: newName
            });

            await updateDoc(doc(db, 'users', user.uid), {
                displayName: newName,
                updatedAt: new Date()
            });

            setUser({ ...auth.currentUser, displayName: newName });
            setIsEditingName(false);
            alert("Name updated successfully!");
        } catch (err) {
            console.error("Error updating name:", err);
            alert("Failed to update name. Please try again.");
        }
        setIsSavingName(false);
    };

    const filteredInteractions = activeTab === 'all'
        ? interactions
        : interactions.filter(i => {
            if (activeTab === 'course') return i.type === 'course_waitlist';
            return i.type === activeTab;
        });

    const totalPages = Math.ceil(filteredInteractions.length / ITEMS_PER_PAGE);
    const paginatedInteractions = filteredInteractions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const getEmptyState = () => {
        if (activeTab === 'ai_suite') {
            return {
                title: "No Tools Yet",
                desc: "You haven't purchased any AI tools yet. Visit the AI Hub to get started."
            };
        }
        if (activeTab === 'ai_history') {
            return {
                title: "No Purchase History",
                desc: "You haven't made any purchases yet."
            };
        }
        switch (activeTab) {
            case 'job':
                return {
                    title: "No Jobs Applied",
                    desc: "You haven't applied for any jobs yet. Check out the latest openings.",
                    btn: "Find Jobs",
                    link: "/jobs"
                };
            case 'internship':
                return {
                    title: "No Internships Applied",
                    desc: "You haven't applied for any internships yet. Browse curated opportunities.",
                    btn: "Find Internships",
                    link: "/internships"
                };
            case 'event':
                return {
                    title: "No Events Found",
                    desc: "You haven't registered for any events yet. Join our upcoming webinars and sessions.",
                    btn: "Browse Events",
                    link: "/events"
                };
            case 'course':
                return {
                    title: "No Courses Joined",
                    desc: "You haven't joined any course waitlists yet. Be the first to know when we launch.",
                    btn: "View Courses",
                    link: "/courses"
                };
            default:
                return {
                    title: "No Activity Found",
                    desc: "You haven't applied for anything yet. Start your journey by exploring the hub.",
                    btn: "Explore Hub",
                    link: "/jobs"
                };
        }
    };

    const EmptyState = () => {
        const { title, desc, btn, link } = getEmptyState();
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center bg-white/5 border border-white/10 rounded-[2.5rem] border-dashed"
            >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaRocket className="text-slate-700 text-2xl" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] max-w-[300px] mx-auto leading-relaxed">
                    {desc}
                </p>
                {btn && link && (
                    <button
                        onClick={() => navigate(link)}
                        className="mt-8 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] tracking-widest hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/10"
                    >
                        {btn}
                    </button>
                )}
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black text-[10px] tracking-widest">Loading your history...</p>
                </div>
            </div>
        );
    }

    return (
        <MainLayout noContainer={true}>
            <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-20 font-sans selection:bg-sky-500/30 overflow-x-hidden relative">
                {/* Background Decor */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/5 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-12">

                    {/* 🚀 HERO SECTION */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-16 relative"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                        >
                            <FaUser size={14} /> Your Account
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Your Profile </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Dashboard</span>
                        </motion.h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                        {/* 👤 Sidebar: User Info */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group hover:border-sky-500/20 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[60px] rounded-full -translate-y-16 translate-x-16"></div>

                                <div className="relative flex flex-col items-center text-center">
                                    <motion.div variants={fadeInUp} className="relative mb-6">
                                        <div className="absolute inset-0 bg-sky-500 blur-2xl opacity-20 animate-pulse"></div>
                                        {user?.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-[2rem] border-2 border-sky-500 relative z-10 p-1 bg-[#020617]" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-[2rem] bg-sky-500/10 border-2 border-sky-500/20 flex items-center justify-center relative z-10">
                                                <FaUser className="text-4xl text-sky-400" />
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.div variants={fadeInUp} className="w-full">
                                        {isEditingName ? (
                                            <div className="flex items-center gap-2 mb-2 w-full px-4">
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="flex-1 bg-white/10 border border-sky-500/30 rounded-xl px-4 py-2 text-white text-[10px] font-black tracking-widest focus:outline-none focus:border-sky-500 transition-all"
                                                    placeholder="Enter new name"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleUpdateName}
                                                    disabled={isSavingName}
                                                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    {isSavingName ? <div className="w-4 h-4 border-2 border-emerald-400/50 border-t-white rounded-full animate-spin"></div> : <FaCheck size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingName(false);
                                                        setNewName(user.displayName || '');
                                                    }}
                                                    className="p-2 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 mb-1 group/name">
                                                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{user?.displayName || 'Explorer'}</h2>
                                                <button
                                                    onClick={() => setIsEditingName(true)}
                                                    className="opacity-0 group-hover/name:opacity-100 p-1.5 text-slate-500 hover:text-sky-400 transition-all hover:scale-110"
                                                    title="Edit Name"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] mb-8 flex items-center justify-center gap-2">
                                            <FaEnvelope className="text-sky-400/50" /> {user?.email}
                                        </p>

                                        <div className="w-full space-y-3">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 group"
                                            >
                                                <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                                            </button>

                                            {(user?.email === 'admin@internshipcatalyst.com') && (
                                                <button
                                                    onClick={() => navigate('/admin/dashboard')}
                                                    className="w-full py-4 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black border border-sky-500/20 rounded-2xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-3"
                                                >
                                                    <FaRocket /> Admin Dashboard
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* 📊 Content: Activity Feed */}
                        <div className="lg:col-span-8 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6"
                            >
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'all'
                                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        } `}
                                >
                                    All Activity
                                </button>
                                <button
                                    onClick={() => setActiveTab('job')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'job'
                                        ? 'bg-sky-500/10 text-sky-400 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                        : 'bg-sky-500/5 text-sky-400/50 border-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/20'
                                        } `}
                                >
                                    Jobs
                                </button>
                                <button
                                    onClick={() => setActiveTab('internship')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'internship'
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'bg-purple-500/5 text-purple-400/50 border-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/20'
                                        } `}
                                >
                                    Internships
                                </button>
                                <button
                                    onClick={() => setActiveTab('event')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'event'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                        : 'bg-emerald-500/5 text-emerald-400/50 border-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                                        } `}
                                >
                                    Events
                                </button>
                                <button
                                    onClick={() => setActiveTab('course')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'course'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                        : 'bg-amber-500/5 text-amber-400/50 border-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/20'
                                        } `}
                                >
                                    Courses
                                </button>
                                <button
                                    onClick={() => setActiveTab('ai_suite')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'ai_suite'
                                        ? 'bg-sky-500 text-black border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                                        : 'bg-sky-500/5 text-sky-400/50 border-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/20'
                                        } `}
                                >
                                    My AI Tools
                                </button>
                                <button
                                    onClick={() => setActiveTab('ai_history')}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${activeTab === 'ai_history'
                                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                        : 'bg-indigo-500/5 text-indigo-400/50 border-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/20'
                                        } `}
                                >
                                    Purchase History
                                </button>
                            </motion.div>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.1 }}
                                className="space-y-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {activeTab === 'ai_suite' ? (
                                        aiHistory.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {aiHistory.map((tool, idx) => {
                                                    const toolName = tool.toolId === 'ats-checker' ? 'ATS Score Checker' :
                                                        tool.toolId === 'skill-gap' ? 'Skill Gap Analyzer' :
                                                            tool.toolId === 'cover-letter' ? 'AI Cover Letter' : 'AI Tool';
                                                    return (
                                                        <motion.div
                                                            key={tool.id}
                                                            variants={fadeInUp}
                                                            className="bg-[#0f172a]/60 border border-sky-500/20 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-sky-500/5 transition-all"
                                                        >
                                                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                                                                <FaBrain size={20} />
                                                            </div>
                                                            <h4 className="text-white font-black text-sm tracking-tight mb-2">{toolName}</h4>
                                                            <p className="text-slate-500 text-[9px] font-black tracking-[0.2em] mb-6">Pro Level Access</p>
                                                            <button
                                                                onClick={() => navigate(
                                                                    tool.toolId === 'ats-checker' ? '/ats-score-checker' :
                                                                        tool.toolId === 'skill-gap' ? '/skill-gap-analyzer' :
                                                                            tool.toolId === 'cover-letter' ? '/cover-letter-ai' : '/ai'
                                                                )}
                                                                className="w-full py-3 bg-white text-black rounded-xl text-[9px] font-black tracking-widest hover:bg-sky-400 transition-all"
                                                            >
                                                                Open Tool
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <EmptyState />
                                        )
                                    ) : activeTab === 'ai_history' ? (
                                        aiHistory.length > 0 ? (
                                            <div className="space-y-4">
                                                {aiHistory.map((item, idx) => {
                                                    const toolName = item.toolId === 'ats-checker' ? 'ATS Score Checker' :
                                                        item.toolId === 'skill-gap' ? 'Skill Gap Analyzer' :
                                                            item.toolId === 'cover-letter' ? 'AI Cover Letter' : 'AI Tool';
                                                    return (
                                                        <motion.div
                                                            key={item.id}
                                                            variants={fadeInUp}
                                                            className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-[1.5rem] flex items-center justify-between gap-4"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                                    <FaCreditCard size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-black text-sm tracking-tight">{toolName}</p>
                                                                    <p className="text-slate-500 text-[9px] font-black tracking-widest">Order ID: {item.paymentId}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-emerald-400 font-black text-sm">₹{item.amount}</p>
                                                                <p className="text-slate-500 text-[9px] font-black tracking-widest">{item.purchasedAt?.toDate() ? item.purchasedAt.toDate().toLocaleDateString() : 'N/A'}</p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <EmptyState />
                                        )
                                    ) : paginatedInteractions.length > 0 ? (
                                        paginatedInteractions.map((item, idx) => (
                                            <motion.div
                                                key={item.id}
                                                variants={fadeInUp}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="group relative"
                                            >
                                                <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${item.type === 'job' ? 'from-sky-500/40 to-blue-600/40' :
                                                    item.type === 'internship' ? 'from-purple-500/40 to-pink-600/40' :
                                                        item.type === 'event' ? 'from-emerald-500/40 to-teal-600/40' :
                                                            'from-amber-500/40 to-orange-600/40'
                                                    } `}></div>
                                                <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-[1.5rem] hover:border-white/20 transition-all group-hover:transform group-hover:scale-[1.01] shadow-lg hover:shadow-2xl">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${item.type === 'job' ? 'bg-sky-500/10 text-sky-400' :
                                                                item.type === 'internship' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                                                                } `}>
                                                                {item.type === 'job' ? <FaBriefcase size={22} /> :
                                                                    item.type === 'internship' ? <FaGraduationCap size={22} /> : <FaCalendarAlt size={22} />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-[9px] font-black tracking-[0.2em] px-2 py-0.5 rounded-md border ${item.type === 'job' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                                                        item.type === 'internship' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                            item.type === 'event' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                        } `}>
                                                                        {item.type === 'course_waitlist' ? 'Course' : item.type}
                                                                    </span>
                                                                    <span className="text-slate-500 text-[9px] font-black tracking-widest flex items-center gap-1">
                                                                        <FaClock size={8} /> {item.timestamp ? item.timestamp.toDate().toLocaleDateString() : 'Just now'}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-base md:text-xl font-black truncate group-hover:text-sky-400 transition-colors tracking-tight">{item.itemTitle}</h4>
                                                                <p className="text-slate-400 text-[10px] font-black tracking-widest flex items-center gap-2 mt-1">
                                                                    {item.itemCompany && <span className="flex items-center gap-1.5"><FaRocket className="text-sky-500/50" /> {item.itemCompany}</span>}
                                                                    {item.itemLocation && <span className="flex items-center gap-1.5"><FaMapPin className="text-indigo-500/50" /> {item.itemLocation}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest flex items-center gap-2">
                                                                {item.type === 'event' ? 'Registered' :
                                                                    item.type === 'course_waitlist' ? 'Subscribed' : 'Applied'} <FaChevronRight size={10} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </AnimatePresence>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mt-12 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaChevronRight className="rotate-180" />
                                        </button>

                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1
                                                        ? 'bg-sky-500 text-black'
                                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                                        } `}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="h-32"></div>
            </div>
        </MainLayout>
    );
}
