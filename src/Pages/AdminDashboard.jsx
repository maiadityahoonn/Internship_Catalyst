import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import {
    FaBriefcase,
    FaGraduationCap,
    FaCalendarAlt,
    FaTrash,
    FaPlus,
    FaTimes,
    FaUsers,
    FaChartPie,
    FaCheck,
    FaBan,
    FaSearch,
    FaUserShield,
    FaEnvelope,
    FaUser,
    FaSignOutAlt,
    FaEdit,
    FaEye,
    FaThumbtack,
    FaRegImage,
    FaRocket,
    FaArrowUp,
    FaArrowDown,
    FaHistory,
    FaShieldAlt
} from 'react-icons/fa';

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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 },
    },
};

// --- Custom Chart Components ---
const StatCard = ({ title, value, subtext, color, icon: Icon }) => (
    <motion.div
        variants={fadeInUp}
        className={`p-6 rounded-[2rem] bg-[#0f172a]/60 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-${color}-500/40 transition-all duration-500`}
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-[60px] rounded-full -translate-y-16 translate-x-16 group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            <h3 className="text-slate-400 text-[10px] font-black tracking-[0.2em] mb-2">{title}</h3>
            <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-white tracking-tight">{value}</p>
                <div className="flex items-center gap-1 text-[10px] font-black tracking-widest text-emerald-400 mb-1">
                    <FaArrowUp size={8} /> {subtext}
                </div>
            </div>
        </div>
    </motion.div>
);

const BarChart = ({ data, color = "sky", title, icon: Icon }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <motion.div
            variants={fadeInUp}
            className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-48 h-48 bg-${color}-500/5 blur-[80px] rounded-full -translate-y-24 translate-x-24`}></div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-10 flex items-center gap-3 tracking-tight relative z-10">
                <Icon className={`text-${color}-400`} size={24} /> {title}
            </h3>
            <div className="flex items-end justify-between h-48 gap-4 w-full relative z-10">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 flex-1 group/bar">
                        <div className="w-full relative h-40 flex items-end px-1 sm:px-2">
                            <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: `${(item.value / maxVal) * 100}%` }}
                                viewport={{ once: false }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className={`w-full bg-gradient-to-t from-${color}-500/20 to-${color}-400/10 rounded-xl border-t-2 border-${color}-400/30 group-hover/bar:from-${color}-500/40 group-hover/bar:to-${color}-400/20 transition-all relative group-hover/bar:shadow-[0_0_30px_rgba(14,165,233,0.15)]`}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                    {item.value}
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-black tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('analytics');
    const [items, setItems] = useState([]);
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ users: 0, jobs: 0, internships: 0, events: 0, courses: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedModerationItem, setSelectedModerationItem] = useState(null);
    const [showModerationModal, setShowModerationModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userInteractions, setUserInteractions] = useState([]);
    const [userInteractionsLoading, setUserInteractionsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate('/auth');
            } else {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    const userData = userDoc.data();
                    const isAdminEmail = currentUser.email === 'admin@internshipcatalyst.com';
                    if (userData?.role === 'admin' || isAdminEmail) {
                        setUser(currentUser);
                    } else {
                        alert("Unauthorized Access. Admin protocols only.");
                        navigate('/');
                    }
                } catch (err) {
                    console.error("Permission check failed:", err);
                    navigate('/');
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        setLoading(true);
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({});
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'analytics') {
            fetchAnalytics();
        } else {
            fetchContent(activeTab);
        }
    }, [activeTab]);

    const fetchUsers = () => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(data);
            setLoading(false);
        });
        return unsubscribe;
    };

    const fetchContent = (collectionName) => {
        let q;
        if (collectionName === 'moderation') {
            q = query(collection(db, 'events'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
        } else {
            q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
        }
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(data);
            setCurrentPage(1);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error fetching data:", err);
            setError(err.message);
            setLoading(false);
        });
        return unsubscribe;
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedItems(items.slice(startIndex, endIndex));
    }, [items, currentPage]);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const fetchAnalytics = async () => {
        try {
            const [usersSnap, jobsSnap, internshipsSnap, eventsSnap, coursesSnap] = await Promise.all([
                getDocs(collection(db, 'users')),
                getDocs(collection(db, 'jobs')),
                getDocs(collection(db, 'internships')),
                getDocs(collection(db, 'events')),
                getDocs(collection(db, 'courses'))
            ]);
            setStats({
                users: usersSnap.size,
                jobs: jobsSnap.size,
                internships: internshipsSnap.size,
                events: eventsSnap.size,
                courses: coursesSnap.size
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            setUserInteractionsLoading(true);
            const q = query(
                collection(db, 'user_interactions'),
                where('userId', '==', selectedUser.id),
                orderBy('timestamp', 'desc')
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserInteractions(docs);
                setUserInteractionsLoading(false);
            }, (err) => {
                console.error("Error fetching user interactions:", err);
                setUserInteractionsLoading(false);
            });
            return () => unsubscribe();
        } else {
            setUserInteractions([]);
        }
    }, [selectedUser]);

    const handleUserAction = async (userId, action) => {
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            if (action === 'delete') {
                await deleteDoc(doc(db, 'users', userId));
                alert("User record deleted from database.");
            } else if (action === 'block') {
                await updateDoc(doc(db, 'users', userId), { isBlocked: true });
                alert("User blocked.");
            } else if (action === 'unblock') {
                await updateDoc(doc(db, 'users', userId), { isBlocked: false });
                alert("User unblocked.");
            }
        } catch (error) {
            alert("Action failed: " + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayInputChange = (e, field) => {
        const value = e.target.value.split(',').map(item => item.trim());
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEdit = (item) => {
        setFormData(item);
        setIsEditing(true);
        setEditingId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanFormData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v != null && v !== ''));
            const payload = {
                ...cleanFormData,
                updatedAt: serverTimestamp()
            };
            if (isEditing) {
                await updateDoc(doc(db, activeTab, editingId), payload);
                alert('Item updated successfully!');
            } else {
                const finalPayload = {
                    ...payload,
                    createdAt: serverTimestamp(),
                    createdBy: user.uid
                };
                await addDoc(collection(db, activeTab), finalPayload);
                alert('Item added successfully!');
            }
            setShowForm(false);
            setFormData({});
            setIsEditing(false);
            setEditingId(null);
        } catch (error) {
            alert("Error saving item: " + error.message);
        }
    };

    const toggleFeatured = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, activeTab, id), {
                isFeatured: !currentStatus,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            alert("Error updating featured status: " + error.message);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await updateDoc(doc(db, 'events', id), { status: 'approved', updatedAt: serverTimestamp() });
                alert("Event approved!");
            } else if (action === 'reject') {
                const collectionName = (activeTab === 'moderation' || activeTab === 'events') ? 'events' : activeTab;
                if (window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) {
                    await deleteDoc(doc(db, collectionName, id));
                    alert("Item deleted.");
                }
            }
            setShowModerationModal(false);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                await signOut(auth);
                navigate('/');
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }
    };

    const renderAnalytics = () => (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="space-y-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Citizens" value={stats.users} subtext="12% Growth" color="sky" icon={FaUsers} />
                <StatCard title="Active Jobs" value={stats.jobs} subtext="Premium Only" color="indigo" icon={FaBriefcase} />
                <StatCard title="Internships" value={stats.internships} subtext="Hand-picked" color="purple" icon={FaGraduationCap} />
                <StatCard title="Live Events" value={stats.events} subtext="Hosting Now" color="emerald" icon={FaCalendarAlt} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <BarChart title="Population Growth" data={[
                    { label: 'Jan', value: 10 }, { label: 'Feb', value: 25 }, { label: 'Mar', value: 18 },
                    { label: 'Apr', value: 30 }, { label: 'May', value: 45 }, { label: 'Jun', value: stats.users }
                ]} color="sky" icon={FaChartPie} />
                <BarChart title="Ecosystem Asset Split" data={[
                    { label: 'Jobs', value: stats.jobs }, { label: 'Interns', value: stats.internships },
                    { label: 'Events', value: stats.events }, { label: 'Courses', value: stats.courses || 0 }
                ]} color="purple" icon={FaRocket} />
            </div>
        </motion.div>
    );

    const renderUsers = () => (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={fadeInUp} className="relative">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search citizens by name or signal identifier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0f172a]/80 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white text-[10px] font-black tracking-widest focus:outline-none focus:border-sky-500 transition-all backdrop-blur-xl placeholder:text-slate-600"
                />
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] text-slate-500">Citizen</th>
                                <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] text-slate-500">Authorization</th>
                                <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] text-slate-500">Boarded At</th>
                                <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] text-slate-500">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black tracking-[0.3em] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.filter(u =>
                                u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((userData) => (
                                <tr key={userData.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 flex items-center gap-4">
                                        <div className="relative">
                                            {userData.photoURL ? (
                                                <img src={userData.photoURL} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20"><FaUser size={18} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm tracking-tight">{userData.displayName || 'Cyber Citizen'}</p>
                                            <p className="text-[9px] font-black tracking-widest text-slate-500 mt-0.5">{userData.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] border ${userData.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700'}`}>
                                            {userData.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black tracking-widest text-slate-400">
                                        {userData.createdAt?.seconds ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-8 py-6">
                                        {userData.isBlocked ? (
                                            <span className="text-rose-400 flex items-center gap-2 text-[9px] font-black tracking-widest bg-rose-500/10 px-3 py-1 rounded-full"><FaBan size={8} /> Terminated</span>
                                        ) : (
                                            <span className="text-emerald-400 flex items-center gap-2 text-[9px] font-black tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full"><FaCheck size={8} /> Verified</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-3">
                                        <button
                                            onClick={() => handleUserAction(userData.id, userData.isBlocked ? 'unblock' : 'block')}
                                            className={`p-3 rounded-xl transition-all ${userData.isBlocked ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white'}`}
                                        >
                                            <FaUserShield size={16} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedUser(userData)}
                                            className="p-3 bg-sky-500/10 text-sky-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all"
                                        >
                                            <FaChartPie size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(userData.id, 'delete')}
                                            className="p-3 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );

    const renderContent = () => (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0f172a]/60 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <div>
                    <p className="text-slate-500 text-[10px] font-black tracking-[0.3em]">Protocol Module</p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight capitalize">{activeTab}</h2>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({});
                        }
                    }}
                    className={`flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-sky-400 rounded-2xl font-black text-[10px] tracking-widest transition-all shadow-xl shadow-white/5 ${activeTab === 'events' ? 'hidden' : ''}`}
                >
                    {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'Shut Down' : 'Initialize New'}
                </button>
            </motion.div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
                    >
                        <h2 className="text-xl md:text-2xl font-black text-white mb-10 tracking-tight">{isEditing ? `Edit Entity` : `Create Entity`}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {renderFormFields()}
                            <button type="submit" className="w-full mt-10 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-[10px] tracking-[0.3em] rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-sky-500/20">
                                {isEditing ? 'Synch Database' : 'Broadcast to Network'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center"><div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto"></div></div>
                ) : paginatedItems.map((item) => (
                    <motion.div
                        layout variants={fadeInUp} key={item.id}
                        className="group relative bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:border-sky-500/30 transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] rounded-full -translate-y-12 translate-x-12 group-hover:bg-sky-500/10 transition-all duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-sky-500/20 transition-all">
                                    {activeTab === 'jobs' ? <FaBriefcase className="text-sky-400" /> : <FaGraduationCap className="text-purple-400" />}
                                </div>
                                <div className="flex gap-2">
                                    {activeTab !== 'moderation' && (
                                        <button onClick={() => toggleFeatured(item.id, item.isFeatured)} className={`p-2 rounded-xl border transition-all ${item.isFeatured ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-amber-500'}`}>
                                            <FaThumbtack size={12} className={item.isFeatured ? '' : '-rotate-45'} />
                                        </button>
                                    )}
                                    <button onClick={() => { setSelectedModerationItem(item); setShowModerationModal(true); }} className="p-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-sky-500 hover:text-black transition-all">
                                        <FaEye size={12} />
                                    </button>
                                    <button onClick={() => handleAction(item.id, 'reject')} className="p-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-base md:text-xl font-black text-white mb-2 tracking-tight line-clamp-1">{item.title}</h3>
                            <p className="text-[10px] font-black tracking-widest text-sky-400 mb-6">{item.company || item.category}</p>

                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black tracking-widest text-slate-500 border border-white/5">{item.location || 'Remote'}</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black tracking-widest text-slate-500 border border-white/5">{item.officeType || 'Entity'}</span>
                            </div>

                            {activeTab !== 'events' && activeTab !== 'moderation' && (
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="w-full mt-8 py-4 bg-white/5 border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 rounded-2xl text-[9px] font-black tracking-[0.2em] transition-all"
                                >
                                    Force Update
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {items.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-6 mt-12 bg-white/5 p-4 rounded-[2rem] border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white text-slate-400 hover:text-black disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-black tracking-widest text-slate-400">Section {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white text-slate-400 hover:text-black disabled:opacity-30 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </motion.div>
    );

    function renderFormFields() {
        const inputClasses = "w-full bg-[#0f172a] border border-white/10 rounded-2xl p-5 text-white text-[10px] font-black tracking-widest focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-700";
        const labelClasses = "block text-[9px] font-black tracking-[0.2em] text-slate-500 mb-3 ml-1";

        const fields = activeTab === 'jobs' ? [
            { name: 'title', label: 'Position', type: 'text' },
            { name: 'company', label: 'Corporation', type: 'text' },
            { name: 'location', label: 'Terminal', type: 'text' },
            { name: 'officeType', label: 'Mode', type: 'select', options: ['in-office', 'remote', 'hybrid'] },
            { name: 'salary', label: 'Credits', type: 'text' },
            { name: 'experience', label: 'Seniority', type: 'text' },
            { name: 'deadline', label: 'Shutdown Date', type: 'date' },
            { name: 'companyUrl', label: 'Access URL', type: 'url' }
        ] : activeTab === 'internships' ? [
            { name: 'title', label: 'Program Name', type: 'text' },
            { name: 'company', label: 'Organization', type: 'text' },
            { name: 'location', label: 'Region', type: 'text' },
            { name: 'officeType', label: 'Mode', type: 'select', options: ['in-office', 'remote', 'hybrid'] },
            { name: 'salary', label: 'Stipend', type: 'text' },
            { name: 'duration', label: 'Lifespan', type: 'text' },
            { name: 'deadline', label: 'Shutdown Date', type: 'date' },
            { name: 'companyUrl', label: 'Access URL', type: 'url' }
        ] : [
            { name: 'title', label: 'Asset Title', type: 'text' },
            { name: 'company', label: 'Source', type: 'text' },
            { name: 'price', label: 'Access Credits', type: 'text' },
            { name: 'duration', label: 'Runtime', type: 'text' },
            { name: 'enrollmentUrl', label: 'Gateway URL', type: 'url' }
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {fields.map(f => (
                    <div key={f.name}>
                        <label className={labelClasses}>{f.label}</label>
                        {f.type === 'select' ? (
                            <select name={f.name} className={inputClasses} onChange={handleInputChange} value={formData[f.name] || ''}>
                                {f.options.map(o => <option key={o} value={o} className="bg-[#0f172a]">{o.toUpperCase()}</option>)}
                            </select>
                        ) : (
                            <input name={f.name} type={f.type} className={inputClasses} placeholder={f.label} onChange={handleInputChange} value={formData[f.name] || ''} />
                        )}
                    </div>
                ))}
                <div className="md:col-span-2">
                    <label className={labelClasses}>Operational Brief</label>
                    <textarea name="description" className={`${inputClasses} h-32 resize-none`} placeholder="Detailed system logs..." onChange={handleInputChange} value={formData.description || ''}></textarea>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-20 sm:pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-12 font-sans overflow-x-hidden relative selection:bg-sky-500/30">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    variants={staggerContainer} initial="hidden" animate="visible"
                    className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"
                >
                    <div className="text-center md:text-left">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black tracking-[0.3em] mb-6">
                            <FaShieldAlt /> System Oversight
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                            <span className="text-white">Master</span> <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500">Command</span>
                        </motion.h1>
                    </div>

                    {user && (
                        <motion.div variants={fadeInUp} className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-5 flex items-center gap-5 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-indigo-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Admin" className="w-14 h-14 rounded-2xl border-2 border-indigo-500/50 p-1" />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border-2 border-indigo-500/30"><FaShieldAlt size={24} /></div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0f172a]"></div>
                            </div>
                            <div className="text-left pr-4">
                                <h3 className="text-white font-black text-[10px] tracking-widest">{user.displayName || 'Architect'}</h3>
                                <p className="text-indigo-400 text-[8px] font-black tracking-[0.3em] mt-1">Super Authority</p>
                            </div>
                            <button onClick={handleLogout} className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                                <FaSignOutAlt size={18} />
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap justify-center gap-4 mb-16 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-xl max-w-4xl mx-auto"
                >
                    {['analytics', 'users', 'jobs', 'internships', 'courses', 'events'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all border ${activeTab === tab ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'bg-transparent text-slate-500 border-transparent hover:text-white hover:bg-white/5'}`}>
                            {tab}
                        </button>
                    ))}
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        {activeTab === 'analytics' && renderAnalytics()}
                        {activeTab === 'users' && renderUsers()}
                        {['jobs', 'internships', 'courses', 'events', 'moderation'].includes(activeTab) && renderContent()}
                    </motion.div>
                </AnimatePresence>

                {/* User Activity Modal */}
                <AnimatePresence>
                    {selectedUser && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                className="bg-[#020617] border border-white/10 rounded-[3rem] p-8 md:p-12 max-w-5xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full -translate-y-32 translate-x-32"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-10 pb-10 border-b border-white/10">
                                        <div className="flex items-center gap-8">
                                            {selectedUser.photoURL ? (
                                                <img src={selectedUser.photoURL} className="w-24 h-24 rounded-3xl border-2 border-sky-500/30 p-1" alt="" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-3xl bg-sky-500/10 flex items-center justify-center text-sky-400 border-2 border-sky-500/20"><FaUser size={40} /></div>
                                            )}
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{selectedUser.displayName}</h2>
                                                <p className="text-slate-500 text-sm font-black tracking-widest mt-2">{selectedUser.email}</p>
                                                <div className="mt-4 flex gap-3">
                                                    <span className="px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest rounded-full">ID: {selectedUser.id.slice(0, 8)}...</span>
                                                    <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest rounded-full">{selectedUser.role || 'Citizen'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedUser(null)} className="p-4 bg-white/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-xl">
                                            <FaTimes size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                        <h3 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tight">
                                            <FaHistory className="text-sky-400" /> Operational History
                                        </h3>
                                        {userInteractionsLoading ? (
                                            <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto"></div></div>
                                        ) : userInteractions.length > 0 ? (
                                            <div className="space-y-4">
                                                {userInteractions.map((int) => (
                                                    <div key={int.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:border-sky-500/30 transition-all">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${int.type === 'job' ? 'bg-blue-500/10 text-blue-400' : int.type === 'internship' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                                {int.type === 'job' ? <FaBriefcase size={20} /> : int.type === 'internship' ? <FaGraduationCap size={20} /> : <FaCalendarAlt size={20} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-black text-sm tracking-tight">{int.title || int.itemTitle || 'Unknown Entry'}</p>
                                                                <p className="text-[9px] font-black tracking-widest text-slate-500 mt-1">{int.type} protocol activated</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-slate-400 text-[10px] font-black tracking-widest">{int.timestamp?.seconds ? new Date(int.timestamp.seconds * 1000).toLocaleDateString() : 'Real-time'}</p>
                                                            <p className="text-emerald-400 text-[9px] font-black tracking-widest mt-1">Success</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
                                                <p className="text-slate-500 font-black tracking-[0.3em]">No Recorded Activity</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <div className="h-32"></div>
        </div>
    );
}

const ChevronLeft = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRight = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18l6-6-6-6" />
    </svg>
);
