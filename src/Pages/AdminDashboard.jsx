import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBriefcase,
    FaGraduationCap,
    FaCalendarAlt,
    FaTrash,
    FaPlus,
    FaTimes,
    FaEdit
} from 'react-icons/fa';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('jobs');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedModerationItem, setSelectedModerationItem] = useState(null);
    const [showModerationModal, setShowModerationModal] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({});

    // Auth Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/auth');
            } else {
                setUser(currentUser);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch Data Real-time
    useEffect(() => {
        setLoading(true);
        let q;
        if (activeTab === 'moderation') {
            q = query(collection(db, 'events'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
        } else {
            q = query(collection(db, activeTab), orderBy('createdAt', 'desc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayInputChange = (e, field) => {
        const value = e.target.value.split(',').map(item => item.trim());
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user) {
                alert("You must be logged in to add items.");
                return;
            }

            // Clean up formData to remove empty strings or undefined
            const cleanFormData = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v != null && v !== '')
            );

            const payload = {
                ...cleanFormData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdBy: user.uid
            };

            await addDoc(collection(db, activeTab), payload);
            alert('Item added successfully!');
            setShowForm(false);
            setFormData({}); // Reset form
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding item: " + error.message);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await updateDoc(doc(db, 'events', id), {
                    status: 'approved',
                    updatedAt: serverTimestamp()
                });
                alert("Event approved and published!");
            } else if (action === 'reject') {
                if (window.confirm("Are you sure you want to reject this event? It will be deleted.")) {
                    await deleteDoc(doc(db, 'events', id));
                    alert("Event rejected and deleted.");
                }
            }
            setShowModerationModal(false);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error: " + error.message);
        }
    };

    // Dynamic Form Fields based on Tab
    const renderFormFields = () => {
        const commonClasses = "w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-sky-500 transition-colors";

        switch (activeTab) {
            case 'jobs':
                return (
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
            case 'internships':
                return (
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
            case 'events':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" placeholder="Event Title" className={commonClasses} onChange={handleInputChange} required />
                            <select name="category" className={commonClasses} onChange={handleInputChange}>
                                <option value="hackathon">Hackathon</option>
                                <option value="workshop">Workshop</option>
                                <option value="webinar">Webinar</option>
                                <option value="competition">Competition</option>
                                <option value="conference">Conference</option>
                            </select>
                            <input name="location" placeholder="Location (or Online)" className={commonClasses} onChange={handleInputChange} required />
                            <select name="locationType" className={commonClasses} onChange={handleInputChange}>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                            <input name="dateRange" placeholder="Date Range (e.g., Nov 10 - Nov 12)" className={commonClasses} onChange={handleInputChange} />
                            <select name="status" className={commonClasses} onChange={handleInputChange}>
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="past">Past</option>
                            </select>
                            <input name="posterLink" placeholder="Poster Image URL" className={commonClasses} onChange={handleInputChange} />
                            <input name="registrationLink" placeholder="Registration URL" className={commonClasses} onChange={handleInputChange} />
                        </div>
                        <textarea name="description" placeholder="Event Description" className={`${commonClasses} mt-4 h-24`} onChange={handleInputChange} />
                        <input name="tags" placeholder="Tags (comma separated)" className={`${commonClasses} mt-4`} onChange={(e) => handleArrayInputChange(e, 'tags')} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Manage your platform content</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {showForm ? <FaTimes /> : <FaPlus />}
                        {showForm ? 'Close Form' : 'Add New Item'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {['jobs', 'internships', 'events', 'moderation'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-bold capitalize transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {tab === 'jobs' && <FaBriefcase />}
                            {tab === 'internships' && <FaGraduationCap />}
                            {tab === 'events' && <FaCalendarAlt />}
                            {tab === 'moderation' && <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Add Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12 overflow-hidden"
                        >
                            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
                                <h2 className="text-xl font-bold text-white mb-6">Add New {activeTab.slice(0, -1)}</h2>
                                <form onSubmit={handleSubmit}>
                                    {renderFormFields()}
                                    <button type="submit" className="mt-6 w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
                                        Publish to Database
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-slate-500 col-span-full text-center">Loading from Firestore...</p>
                    ) : items.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                            <p className="text-slate-500 text-lg">No items found in {activeTab}.</p>
                            <button onClick={() => setShowForm(true)} className="text-sky-400 font-bold mt-2 hover:underline">Add First Item</button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                                        <p className="text-sm text-sky-400 font-medium">{item.company || item.category}</p>
                                    </div>
                                    {activeTab === 'moderation' ? (
                                        <button
                                            onClick={() => { setSelectedModerationItem(item); setShowModerationModal(true); }}
                                            className="px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all text-xs font-bold"
                                        >
                                            Verify Event
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(item.id, 'reject')}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-slate-400">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                        {item.location || item.locationType}
                                    </p>
                                    {item.salary && (
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {item.salary}
                                        </p>
                                    )}
                                    {item.dateRange && (
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            {item.dateRange}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                                    <span>ID: {item.id.slice(0, 8)}...</span>
                                    {/* Handle serverTimestamp properly */}
                                    <span className="bg-slate-800 px-2 py-1 rounded">
                                        {item.createdAt?.seconds
                                            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                                            : 'Just now'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Moderation Verification Modal */}
                <AnimatePresence>
                    {showModerationModal && selectedModerationItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                            >
                                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur-xl p-6 border-b border-white/10 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Verification: {selectedModerationItem.title}</h2>
                                        <p className="text-slate-400 text-sm">Review event intel before clearance</p>
                                    </div>
                                    <button onClick={() => setShowModerationModal(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="p-8 space-y-10">
                                    {/* Organizer Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-6 rounded-2xl">
                                        <div>
                                            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-4">Organizer Details</h3>
                                            <div className="space-y-2">
                                                <p className="text-white font-bold">{selectedModerationItem.organizerName}</p>
                                                <p className="text-slate-400 text-sm">{selectedModerationItem.organizerDesignation}</p>
                                                <p className="text-slate-500 text-xs">{selectedModerationItem.organizerEmail} • {selectedModerationItem.organizerPhone}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Event Core</h3>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-white"><span className="text-slate-500">Category:</span> {selectedModerationItem.category}</p>
                                                <p className="text-white"><span className="text-slate-500">Type:</span> {selectedModerationItem.type}</p>
                                                <p className="text-white"><span className="text-slate-500">Mode:</span> {selectedModerationItem.mode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Event Memo</h3>
                                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl text-slate-400 text-sm italic">
                                            "{selectedModerationItem.description}"
                                        </div>
                                    </div>

                                    {/* Links & Peripherals */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Registration Link</p>
                                            <a href={selectedModerationItem.registrationLink} target="_blank" className="text-sky-400 text-xs truncate block hover:underline">{selectedModerationItem.registrationLink}</a>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Poster URL</p>
                                            <a href={selectedModerationItem.posterLink} target="_blank" className="text-indigo-400 text-xs truncate block hover:underline">{selectedModerationItem.posterLink}</a>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Finance</p>
                                            <p className="text-white text-xs font-bold">{selectedModerationItem.registrationType} • {selectedModerationItem.entryFee || 'Free'}</p>
                                        </div>
                                    </div>

                                    {/* FAQs */}
                                    {selectedModerationItem.faqs && selectedModerationItem.faqs.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Host FAQ Feed</h3>
                                            <div className="space-y-3">
                                                {selectedModerationItem.faqs.map((faq, i) => (
                                                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                                        <p className="text-white text-sm font-bold mb-1">Q: {faq.question}</p>
                                                        <p className="text-slate-400 text-sm">A: {faq.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Controls */}
                                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4">
                                        <button
                                            onClick={() => handleAction(selectedModerationItem.id, 'approve')}
                                            className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            Clear for Takeoff (Approve)
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedModerationItem.id, 'reject')}
                                            className="flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            Deny Entry (Reject)
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
