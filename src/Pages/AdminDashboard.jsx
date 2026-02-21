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
    FaRegImage
} from 'react-icons/fa';

// --- Custom Chart Components (Since recharts is not available) ---
const StatCard = ({ title, value, subtext, color }) => (
    <div className={`p-5 md:p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-${color}-500/30 transition-all`}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-[50px] rounded-full -translate-y-10 translate-x-10`}></div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
        <p className={`text-4xl font-black text-white mb-2 group-hover:text-${color}-400 transition-colors`}>{value}</p>
        <p className="text-slate-500 text-xs">{subtext}</p>
    </div>
);

const BarChart = ({ data, color = "sky" }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <div className="flex items-end justify-between h-48 gap-2 w-full">
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full relative h-40 flex items-end">
                        <div
                            style={{ height: `${(item.value / maxVal) * 100}%` }}
                            className={`w-full bg-${color}-500/20 rounded-t-lg group-hover:bg-${color}-500/40 transition-all relative group-hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]`}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.value}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
                </div>
            ))}
        </div>
    );
};


export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('analytics'); // Default to Analytics
    const [items, setItems] = useState([]);
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [users, setUsers] = useState([]); // Store all users
    const [stats, setStats] = useState({ users: 0, jobs: 0, internships: 0, events: 0 });
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
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({});

    // Auth & Permission Check
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

    // Data Fetching Router
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
            setCurrentPage(1); // Reset to first page on tab change
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error fetching data:", err);
            setError(err.message);
            setLoading(false);
        });
        return unsubscribe;
    };

    // Pagination Effect
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedItems(items.slice(startIndex, endIndex));
    }, [items, currentPage]);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const fetchAnalytics = async () => {
        try {
            // Parallel interactions for speed
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

    // Fetch User Interactions when selectedUser changes
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

    // --- Actions ---

    const handleUserAction = async (userId, action) => {
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            if (action === 'delete') {
                await deleteDoc(doc(db, 'users', userId));
                // Note: This only deletes Firestore record, not Auth. Auth deletion requires Admin SDK/Cloud Functions.
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
                const collectionName = activeTab === 'moderation' ? 'events' : activeTab;
                if (window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) {
                    await deleteDoc(doc(db, collectionName, id));
                    alert("Item deleted.");
                    // Refresh data if needed, or rely on Snapshot
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

    // --- Tab Renderers ---

    const renderAnalytics = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.users} subtext="+12% from last month" color="sky" />
                <StatCard title="Active Jobs" value={stats.jobs} subtext="Across 15 industries" color="blue" />
                <StatCard title="Internships" value={stats.internships} subtext="Pending verification: 2" color="purple" />
                <StatCard title="Events" value={stats.events} subtext="Next big event in 3 days" color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FaChartPie className="text-sky-400" /> Platform Growth</h3>
                    <BarChart data={[
                        { label: 'Jan', value: 10 }, { label: 'Feb', value: 25 }, { label: 'Mar', value: 18 },
                        { label: 'Apr', value: 30 }, { label: 'May', value: 45 }, { label: 'Jun', value: stats.users }
                    ]} color="sky" />
                </div>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FaBriefcase className="text-purple-400" /> Content Distribution</h3>
                    <BarChart data={[
                        { label: 'Jobs', value: stats.jobs }, { label: 'Interns', value: stats.internships },
                        { label: 'Events', value: stats.events }, { label: 'Courses', value: stats.courses || 0 }
                    ]} color="purple" />
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-sky-500 transition-all"
                />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-900/80 text-slate-300">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.filter(u =>
                                u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((userData) => (
                                <tr key={userData.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {userData.photoURL ? (
                                            <img src={userData.photoURL} className="w-8 h-8 rounded-full" alt="" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400"><FaUser /></div>
                                        )}
                                        <div>
                                            <p className="font-bold text-white">{userData.displayName || 'Explore User'}</p>
                                            <p className="text-xs">{userData.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${userData.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {userData.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {userData.createdAt?.seconds ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {userData.isBlocked ? (
                                            <span className="text-rose-400 flex items-center gap-1"><FaBan size={10} /> Blocked</span>
                                        ) : (
                                            <span className="text-emerald-400 flex items-center gap-1"><FaCheck size={10} /> Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleUserAction(userData.id, userData.isBlocked ? 'unblock' : 'block')}
                                            className={`p-2 rounded-lg transition-all ${userData.isBlocked ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white'}`}
                                            title={userData.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            <FaUserShield size={14} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedUser(userData)}
                                            className="p-2 bg-sky-500/10 text-sky-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all"
                                            title="View User Activity"
                                        >
                                            <FaChartPie size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(userData.id, 'delete')}
                                            className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                            title="Delete User Database Record"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <p className="text-slate-400 text-sm">Managing: <span className="text-white font-bold capitalize">{activeTab}</span></p>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({});
                        }
                    }}
                    className={`flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-sky-500/20 text-sm ${activeTab === 'events' ? 'hidden' : ''}`}
                >
                    {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'Close' : 'Add New'}
                </button>
            </div>

            {/* Dynamic Form Injection */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl mb-8">
                            <h2 className="text-xl font-bold text-white mb-6">{isEditing ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Reuse previous renderFormFields logic here, simplified for brevity in this replace block. 
                                   In a real scenario, I'd keep the renderFormFields function or componentize it. 
                                   For this full file replacement, I will re-include the switch case below.
                                */}
                                {renderFormFields()}
                                <button type="submit" className="mt-6 w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
                                    {isEditing ? 'Update in Database' : 'Publish to Database'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p className="text-center col-span-full">Loading...</p> : paginatedItems.map((item) => (
                    <motion.div layout key={item.id} className="group relative bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                                <div className="text-xs text-sky-400 font-bold uppercase tracking-wider mt-1">{item.company || item.category}</div>
                                <div className="text-[10px] text-slate-500 mt-2 flex flex-wrap gap-2">
                                    <span className="bg-white/5 px-2 py-0.5 rounded-full">{item.location || 'Remote'}</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded-full">{item.officeType || 'Full-time'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {activeTab !== 'moderation' && activeTab !== 'users' && (
                                    <button
                                        onClick={() => toggleFeatured(item.id, item.isFeatured)}
                                        className={`p-2 rounded-lg transition-colors ${item.isFeatured ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-500'}`}
                                        title={item.isFeatured ? "Unpin from Top" : "Pin to Top"}
                                    >
                                        <FaThumbtack size={12} className={item.isFeatured ? '' : '-rotate-45'} />
                                    </button>
                                )}
                                {activeTab !== 'moderation' && activeTab !== 'events' && activeTab !== 'users' && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-sky-500/10 hover:bg-sky-500 hover:text-white rounded-lg transition-colors text-sky-400"
                                        title="Edit Item"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedModerationItem(item);
                                        setShowModerationModal(true);
                                    }}
                                    className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors text-slate-400"
                                    title="View Details"
                                >
                                    <FaEye size={14} />
                                </button>
                                <button
                                    onClick={() => handleAction(item.id, 'reject')}
                                    className="p-2 bg-white/5 hover:bg-rose-500 hover:text-white rounded-lg transition-colors text-slate-400"
                                    title="Delete Item"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {!loading && items.length === 0 && <p className="text-center col-span-full text-slate-500">No items found.</p>}
            </div>

            {/* Pagination Controls */}
            {items.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold"
                    >
                        Previous
                    </button>
                    <span className="text-slate-400 text-sm">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );

    // Helper for Form Fields
    function renderFormFields() {
        const commonClasses = "w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600";
        if (activeTab === 'jobs') return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Job Title" className={commonClasses} onChange={handleInputChange} required />
                    <input name="company" placeholder="Company Name" className={commonClasses} onChange={handleInputChange} required />
                    <input name="location" placeholder="Location" className={commonClasses} onChange={handleInputChange} required />
                    <select name="officeType" className={commonClasses} onChange={handleInputChange}>
                        <option value="in-office">In-Office</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                    <input name="salary" placeholder="Salary (e.g., 3 LPA - 5 LPA)" className={commonClasses} onChange={handleInputChange} />
                    <input name="experience" placeholder="Experience (e.g., 0-2 years)" className={commonClasses} onChange={handleInputChange} />
                    <input name="startDate" placeholder="Start Date (e.g., Immediate)" className={commonClasses} onChange={handleInputChange} />
                    <input name="deadline" type="date" className={commonClasses} onChange={handleInputChange} />
                    <input name="openings" type="number" placeholder="No. of Openings" className={commonClasses} onChange={handleInputChange} />
                    <input name="companyUrl" placeholder="Application/Company URL" className={commonClasses} onChange={handleInputChange} />
                    <input name="companyLogo" placeholder="Logo URL or Emoji" className={commonClasses} onChange={handleInputChange} />
                </div>
                <textarea name="description" placeholder="Job Description" className={`${commonClasses} mt-4 h-24`} onChange={handleInputChange} />
                <input name="skills" placeholder="Skills (comma separated)" className={`${commonClasses} mt-4`} onChange={(e) => handleArrayInputChange(e, 'skills')} />
                <div className="flex items-center gap-3 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <input
                        type="checkbox"
                        name="isVerified"
                        id="isVerifiedJob"
                        onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                        className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                    />
                    <label htmlFor="isVerifiedJob" className="text-slate-300 font-medium cursor-pointer select-none">Mark as Verified by Admin</label>
                </div>
            </>
        );
        if (activeTab === 'internships') return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Internship Title" className={commonClasses} onChange={handleInputChange} required />
                    <input name="company" placeholder="Company Name" className={commonClasses} onChange={handleInputChange} required />
                    <input name="location" placeholder="Location" className={commonClasses} onChange={handleInputChange} required />
                    <select name="officeType" className={commonClasses} onChange={handleInputChange}>
                        <option value="in-office">In-Office</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                    <input name="salary" placeholder="Stipend (e.g., 10k/month)" className={commonClasses} onChange={handleInputChange} />
                    <input name="duration" placeholder="Duration (e.g., 3 months)" className={commonClasses} onChange={handleInputChange} />
                    <input name="startDate" placeholder="Start Date" className={commonClasses} onChange={handleInputChange} />
                    <input name="deadline" type="date" className={commonClasses} onChange={handleInputChange} />
                    <input name="openings" type="number" placeholder="No. of Openings" className={commonClasses} onChange={handleInputChange} />
                    <input name="companyUrl" placeholder="Application/Company URL" className={commonClasses} onChange={handleInputChange} />
                    <input name="companyLogo" placeholder="Logo URL or Emoji" className={commonClasses} onChange={handleInputChange} />
                </div>
                <textarea name="description" placeholder="Internship Description" className={`${commonClasses} mt-4 h-24`} onChange={handleInputChange} />
                <input name="skills" placeholder="Skills (comma separated)" className={`${commonClasses} mt-4`} onChange={(e) => handleArrayInputChange(e, 'skills')} />
                <div className="flex items-center gap-3 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <input
                        type="checkbox"
                        name="isVerified"
                        id="isVerifiedInternship"
                        onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                        className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                    />
                    <label htmlFor="isVerifiedInternship" className="text-slate-300 font-medium cursor-pointer select-none">Mark as Verified by Admin</label>
                </div>
            </>
        );
        if (activeTab === 'courses') return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Course Title" className={commonClasses} onChange={handleInputChange} required />
                    <input name="company" placeholder="Instructor/Organization" className={commonClasses} onChange={handleInputChange} required />
                    <input name="price" placeholder="Price (e.g., ₹4999)" className={commonClasses} onChange={handleInputChange} required />
                    <input name="duration" placeholder="Duration (e.g., 6 Weeks)" className={commonClasses} onChange={handleInputChange} />
                    <input name="level" placeholder="Level (Beginner/Advanced)" className={commonClasses} onChange={handleInputChange} />
                    <input name="language" placeholder="Language (English/Hindi)" className={commonClasses} onChange={handleInputChange} />
                    <input name="rating" placeholder="Initial Rating (e.g. 4.8)" className={commonClasses} onChange={handleInputChange} />
                    <input name="students" placeholder="Initial Students Count" className={commonClasses} onChange={handleInputChange} />
                    <input name="image" placeholder="Course Thumbnail URL" className={commonClasses} onChange={handleInputChange} />
                    <input name="enrollmentUrl" placeholder="Enrollment/Payment URL" className={commonClasses} onChange={handleInputChange} />
                </div>
                <textarea name="description" placeholder="Course Description & Curriculum" className={`${commonClasses} mt-4 h-24`} onChange={handleInputChange} />
                <input name="tags" placeholder="Tags (comma separated)" className={`${commonClasses} mt-4`} onChange={(e) => handleArrayInputChange(e, 'tags')} />
            </>
        );
        return null;
    }


    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero */}
                {/* Header with Profile Card */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <FaUserShield /> Admin Console
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight"><span className="text-white">Master</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">Control</span></h1>
                        <p className="text-slate-400 max-w-2xl mt-4">Manage users, track usage, and moderate content from one central hub.</p>
                    </div>

                    {/* Admin Profile Card */}
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
                        >
                            <div className="relative">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Admin" className="w-12 h-12 rounded-full border-2 border-indigo-500" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border-2 border-indigo-500/50">
                                        <FaUserShield size={20} />
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold text-sm">{user.displayName || 'Administrator'}</h3>
                                <p className="text-indigo-400 text-xs font-medium uppercase tracking-wider">Super Admin</p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <FaSignOutAlt size={18} />
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Navigation Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['analytics', 'users', 'jobs', 'internships', 'courses', 'events'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${activeTab === tab ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {activeTab === 'analytics' && renderAnalytics()}
                {activeTab === 'users' && renderUsers()}
                {['jobs', 'internships', 'events', 'moderation'].includes(activeTab) && renderContent()}

                {/* User Details Modal */}
                <AnimatePresence>
                    {selectedUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        {selectedUser.photoURL ? (
                                            <img src={selectedUser.photoURL} className="w-16 h-16 rounded-full border-2 border-sky-500" alt="" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-2xl"><FaUser /></div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{selectedUser.displayName}</h2>
                                            <p className="text-slate-400">{selectedUser.email}</p>
                                            <p className="text-xs text-slate-500 mt-1">UID: {selectedUser.id}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><FaChartPie className="text-sky-400" /> User Activity History</h3>

                                    {userInteractionsLoading ? (
                                        <p className="text-center text-slate-500 py-8">Loading history...</p>
                                    ) : userInteractions.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-slate-400">
                                                <thead className="text-xs uppercase bg-slate-900/50 text-slate-300">
                                                    <tr>
                                                        <th className="px-4 py-3">Type</th>
                                                        <th className="px-4 py-3">Title</th>
                                                        <th className="px-4 py-3">Status</th>
                                                        <th className="px-4 py-3">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {userInteractions.map((interaction) => (
                                                        <tr key={interaction.id} className="hover:bg-white/5">
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${interaction.type === 'job' ? 'bg-blue-500/10 text-blue-400' :
                                                                    interaction.type === 'internship' ? 'bg-purple-500/10 text-purple-400' :
                                                                        interaction.type === 'event' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                            'bg-amber-500/10 text-amber-400'
                                                                    }`}>
                                                                    {interaction.type || 'Activity'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-white">{interaction.title || interaction.courseTitle || 'Unknown Activity'}</td>
                                                            <td className="px-4 py-3">
                                                                {interaction.status ? (
                                                                    <span className="text-emerald-400 flex items-center gap-1"><FaCheck size={10} /> {interaction.status}</span>
                                                                ) : (
                                                                    <span className="text-slate-500">Applied</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {interaction.timestamp?.seconds ? new Date(interaction.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-white/5">
                                            <FaBriefcase className="mx-auto text-4xl text-slate-600 mb-4" />
                                            <p className="text-slate-400">No activity found for this user.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Content Moderation & Details Modal */}
                <AnimatePresence>
                    {showModerationModal && selectedModerationItem && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setShowModerationModal(false)}
                                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
                                >
                                    <FaTimes />
                                </button>

                                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-2xl bg-black/50 flex items-center justify-center text-4xl border border-white/10 overflow-hidden">
                                        {selectedModerationItem.posterLink || selectedModerationItem.companyLogo ? (
                                            <img
                                                src={getOptimizedImageUrl(selectedModerationItem.posterLink || selectedModerationItem.companyLogo, { w: 100, h: 100 })}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaRegImage className="text-slate-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                            {activeTab === 'moderation' ? 'Pending Approval' : activeTab.slice(0, -1)} Details
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2">{selectedModerationItem.title}</h2>
                                        <p className="text-sky-400 font-bold">{selectedModerationItem.company || selectedModerationItem.category}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {Object.entries(selectedModerationItem).map(([key, value]) => {
                                        if (['id', 'title', 'description', 'createdAt', 'updatedAt', 'createdBy'].includes(key)) return null;
                                        if (typeof value === 'object' && value !== null) return null;
                                        return (
                                            <div key={key} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                <p className="text-sm text-white font-bold truncate">{value?.toString() || 'N/A'}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Description</h3>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedModerationItem.description || 'No description provided.'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {(activeTab === 'moderation' || (activeTab === 'events' && selectedModerationItem.status === 'pending')) && (
                                        <button
                                            onClick={() => handleAction(selectedModerationItem.id, 'approve')}
                                            className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Approve Event
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this item permanently?')) {
                                                handleAction(selectedModerationItem.id, 'reject');
                                            }
                                        }}
                                        className="flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        Delete Item
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
