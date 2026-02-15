import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Link as LinkIcon,
    Upload,
    CheckCircle,
    AlertCircle,
    Type,
    AlignLeft,
    Users,
    DollarSign,
    Gift,
    Trophy,
    ChevronRight,
    ChevronLeft,
    Info,
    Sparkles,
    Target,
    Phone
} from 'lucide-react';

export default function AddEvent() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Organizer Information
        organizerName: '',
        organizerPhone: '',
        organizerEmail: '',
        organizerDesignation: '',
        // Certification Section [NEW]
        certificateWinners: 'Digital',
        certificateParticipants: 'Digital',
        hasWinnerRewards: false,
        winnerPrizes: '',
        winnerTrophy: '',
        winnerGoodies: '',
        // Registration & Payment [MODIFIED]
        registrationType: 'Free',
        registrationLink: '',
        entryFee: '',
        pricingDetails: '',
        status: 'pending',
        detailedLocation: '',
        // Step 2: Core Details
        title: '',
        description: '',
        category: 'Technical',
        type: 'Hackathon',
        startDate: '',
        endDate: '',
        registerByDate: '',
        mode: 'Offline',
        posterLink: '',
        // FAQs [NEW]
        faqs: [{ question: '', answer: '' }],
        // Additional Materials
        brochureLink: '',
        perks: '',
        prizes: '',
        teamSize: '',
        contactInfo: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFAQ = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const handleFAQChange = (index, field, value) => {
        const newFaqs = [...formData.faqs];
        newFaqs[index][field] = value;
        setFormData(prev => ({ ...prev, faqs: newFaqs }));
    };

    const removeFAQ = (index) => {
        if (formData.faqs.length > 1) {
            const newFaqs = formData.faqs.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, faqs: newFaqs }));
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.organizerName || !formData.organizerEmail || !formData.organizerPhone || !formData.organizerDesignation)) {
            setError("All organizer fields are required.");
            return;
        }
        if (step === 2 && (!formData.title || !formData.description || !formData.startDate || !formData.registerByDate || !formData.posterLink)) {
            setError("Please fill all required event details and schedule fields.");
            return;
        }
        if (step === 3 && !formData.registrationLink) {
            setError("Registration link is required for Step 3.");
            return;
        }
        setError('');
        setStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setError('');
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await addDoc(collection(db, 'events'), {
                ...formData,
                status: 'pending',
                tags: formData.category ? [formData.category] : [],
                perks: formData.perks.split(',').map(s => s.trim()).filter(Boolean),
                createdAt: serverTimestamp()
            });

            setSuccess(true);
        } catch (err) {
            console.error("Error adding event:", err);
            setError(err.message || "Failed to submit event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Organizer', icon: <Users size={18} /> },
        { id: 2, title: 'Core Details', icon: <Type size={18} /> },
        { id: 3, title: 'Connections', icon: <LinkIcon size={18} /> },
        { id: 4, title: 'Check Out', icon: <DollarSign size={18} /> },
        { id: 5, title: 'Finish', icon: <CheckCircle size={18} /> }
    ];

    if (success) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0f172a]/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 max-w-lg w-full text-center shadow-2xl"
                >
                    <div className="w-24 h-24 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <CheckCircle className="w-12 h-12 text-sky-400" />
                        <div className="absolute inset-0 bg-sky-500/10 blur-xl rounded-full"></div>
                    </div>
                    <h2 className="text-4xl font-black mb-4">Launch Site!</h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        Your event is now in the docking bay. Our pilots (admins) will review and clear it for takeoff shortly.
                    </p>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setStep(1);
                            setFormData({
                                organizerName: '', organizerPhone: '', organizerEmail: '', organizerDesignation: '',
                                title: '', category: 'hackathon', mode: 'offline', location: '',
                                startDate: '', endDate: '', registrationLink: '', posterLink: '',
                                brochureLink: '', description: '', perks: '', prizes: '',
                                teamSize: '', entryFee: 'Free', contactInfo: ''
                            });
                        }}
                        className="px-10 py-4 bg-white text-black rounded-2xl font-black transition-all hover:bg-sky-400 hover:scale-105 active:scale-95 w-full shadow-xl shadow-white/5"
                    >
                        Host Another Event
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden selection:bg-sky-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={14} /> Creator Studio
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Host an </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Experience</span>
                    </h1>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 px-2 max-w-2xl mx-auto relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10"></div>
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <motion.div
                                animate={{
                                    scale: step === s.id ? 1.2 : 1,
                                    backgroundColor: step >= s.id ? '#0ea5e9' : '#1e293b',
                                    borderColor: step >= s.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'
                                }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors duration-500 ${step >= s.id ? 'text-white' : 'text-slate-500'}`}
                            >
                                {step > s.id ? <CheckCircle size={18} /> : s.icon}
                            </motion.div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${step >= s.id ? 'text-white' : 'text-slate-600'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-16 left-0 right-0 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 z-20 backdrop-blur-md"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </motion.div>
                    )}

                    <motion.div
                        className="bg-[#0f172a]/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-xl font-bold border-b border-white/10 pb-4">Personal & Organizer Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-3">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="organizerName"
                                                    value={formData.organizerName}
                                                    onChange={handleChange}
                                                    placeholder="Full Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-3">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="organizerPhone"
                                                    value={formData.organizerPhone}
                                                    onChange={handleChange}
                                                    placeholder="Phone number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-3">Email *</label>
                                                <input
                                                    type="email"
                                                    name="organizerEmail"
                                                    value={formData.organizerEmail}
                                                    onChange={handleChange}
                                                    placeholder="Email address"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-3">Designation *</label>
                                                <input
                                                    type="text"
                                                    name="organizerDesignation"
                                                    value={formData.organizerDesignation}
                                                    onChange={handleChange}
                                                    placeholder="Designation"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        {/* Event Details Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold">Event Details</h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Event Title *</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        placeholder="Event Title"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Event Description *</label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        placeholder="Event description..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                                                    ></textarea>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-400 mb-2">Category *</label>
                                                        <select
                                                            name="category"
                                                            value={formData.category}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all appearance-none cursor-pointer"
                                                        >
                                                            {['Technical', 'Cultural', 'Management', 'Entrepreneurship', 'Arts & Design', 'Science', 'Literature', 'Social', 'Environment', 'Innovation'].map(cat => (
                                                                <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-400 mb-2">Type *</label>
                                                        <select
                                                            name="type"
                                                            value={formData.type}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all appearance-none cursor-pointer"
                                                        >
                                                            {['Hackathon', 'Workshop', 'Conference', 'Competition', 'Seminar', 'Webinar', 'Tech Fest', 'Cultural Fest', 'Ideathon', 'Paper Presentation'].map(type => (
                                                                <option key={type} value={type} className="bg-[#0f172a]">{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Separator with title */}
                                        <div className="relative flex items-center justify-center py-4">
                                            <div className="absolute inset-x-0 h-px bg-white/10"></div>
                                            <span className="relative px-4 bg-[#0f172a] text-xs font-bold uppercase tracking-widest text-slate-500">Event Schedule</span>
                                        </div>

                                        {/* Event Schedule Section */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Start Date *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            name="startDate"
                                                            value={formData.startDate}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">End Date *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            name="endDate"
                                                            value={formData.endDate}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Register By Date *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            name="registerByDate"
                                                            value={formData.registerByDate}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-4">Mode of Event *</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {['Online', 'Offline', 'Hybrid'].map((mode) => (
                                                        <label
                                                            key={mode}
                                                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${formData.mode === mode ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="mode"
                                                                value={mode}
                                                                checked={formData.mode === mode}
                                                                onChange={handleChange}
                                                                className="hidden"
                                                            />
                                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.mode === mode ? 'border-sky-500' : 'border-slate-600'}`}>
                                                                {formData.mode === mode && <div className="w-2 h-2 bg-sky-500 rounded-full"></div>}
                                                            </div>
                                                            <span className="font-bold">{mode}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-2">Event Poster Link *</label>
                                                <input
                                                    type="url"
                                                    name="posterLink"
                                                    value={formData.posterLink}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/poster.jpg"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                                <p className="text-[10px] text-slate-500 mt-2 ml-1">Provide a link to the event poster (JPG, PNG, Google Drive, etc.)</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        {/* Location Information */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold">Location Information</h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-4">Country *</label>
                                                    <div className="flex gap-4">
                                                        {['India', 'Global'].map((c) => (
                                                            <label
                                                                key={c}
                                                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all cursor-pointer ${formData.country === c ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="country"
                                                                    value={c}
                                                                    checked={formData.country === c}
                                                                    onChange={handleChange}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.country === c ? 'border-sky-500' : 'border-slate-600'}`}>
                                                                    {formData.country === c && <div className="w-2 h-2 bg-sky-500 rounded-full"></div>}
                                                                </div>
                                                                <span className="font-bold">{c}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Google Map Link</label>
                                                    <input
                                                        type="url"
                                                        name="googleMapsLink"
                                                        value={formData.googleMapsLink}
                                                        onChange={handleChange}
                                                        placeholder="https://maps.google.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Detailed Address (Optional)</label>
                                                    <textarea
                                                        name="detailedLocation"
                                                        value={formData.detailedLocation}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        placeholder="Room No, Building Name, Street, Landmark..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Certification Section */}
                                        <div className="space-y-8">
                                            <div className="h-px bg-white/10"></div>
                                            <h3 className="text-xl font-bold">Certification</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-4">Certificate for Winners *</label>
                                                    <div className="flex flex-wrap gap-4">
                                                        {['Physical', 'Digital', 'No'].map((opt) => (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${formData.certificateWinners === opt ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="certificateWinners"
                                                                    value={opt}
                                                                    checked={formData.certificateWinners === opt}
                                                                    onChange={handleChange}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.certificateWinners === opt ? 'border-sky-500' : 'border-slate-600'}`}>
                                                                    {formData.certificateWinners === opt && <div className="w-2 h-2 bg-sky-500 rounded-full"></div>}
                                                                </div>
                                                                <span className="font-bold">{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-4">Certificate for Participants *</label>
                                                    <div className="flex flex-wrap gap-4">
                                                        {['Physical', 'Digital', 'No'].map((opt) => (
                                                            <label
                                                                key={opt}
                                                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${formData.certificateParticipants === opt ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="certificateParticipants"
                                                                    value={opt}
                                                                    checked={formData.certificateParticipants === opt}
                                                                    onChange={handleChange}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.certificateParticipants === opt ? 'border-sky-500' : 'border-slate-600'}`}>
                                                                    {formData.certificateParticipants === opt && <div className="w-2 h-2 bg-sky-500 rounded-full"></div>}
                                                                </div>
                                                                <span className="font-bold">{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Winner Special Rewards [NEW] */}
                                        <div className="space-y-6">
                                            <div className="h-px bg-white/10"></div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                                        <Trophy className="text-yellow-400" size={24} /> Winner Special Rewards
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">Add trophies, prizes or goodies for the winners (optional)</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, hasWinnerRewards: !prev.hasWinnerRewards }))}
                                                    className={`w-14 h-8 rounded-full transition-all relative ${formData.hasWinnerRewards ? 'bg-sky-500' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.hasWinnerRewards ? 'left-7' : 'left-1'}`}></div>
                                                </button>
                                            </div>

                                            {formData.hasWinnerRewards && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                                >
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <DollarSign size={12} className="text-emerald-400" /> Cash Prize
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="winnerPrizes"
                                                            value={formData.winnerPrizes}
                                                            onChange={handleChange}
                                                            placeholder="e.g. ₹50k for 1st"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Trophy size={12} className="text-yellow-400" /> Trophy / Medal
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="winnerTrophy"
                                                            value={formData.winnerTrophy}
                                                            onChange={handleChange}
                                                            placeholder="e.g. Winner Shield"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Gift size={12} className="text-rose-400" /> Goodies / Swag
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="winnerGoodies"
                                                            value={formData.winnerGoodies}
                                                            onChange={handleChange}
                                                            placeholder="e.g. T-shirts & Bags"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Event Links & Social Media */}
                                        <div className="space-y-8">
                                            <div className="h-px bg-white/10"></div>
                                            <h3 className="text-xl font-bold">Event Links & Social Media</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Website Link</label>
                                                    <input
                                                        type="url"
                                                        name="websiteLink"
                                                        value={formData.websiteLink}
                                                        onChange={handleChange}
                                                        placeholder="https://websiteLink.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Instagram</label>
                                                    <input
                                                        type="url"
                                                        name="instagram"
                                                        value={formData.instagram}
                                                        onChange={handleChange}
                                                        placeholder="https://instagram.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Optional Pricing Details / Notes</label>
                                                    <textarea
                                                        name="pricingDetails"
                                                        value={formData.pricingDetails}
                                                        onChange={handleChange}
                                                        rows="2"
                                                        placeholder="Any extra info about entry fees or tickets..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Linkedin</label>
                                                    <input
                                                        type="url"
                                                        name="linkedin"
                                                        value={formData.linkedin}
                                                        onChange={handleChange}
                                                        placeholder="https://linkedin.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Whatsapp</label>
                                                    <input
                                                        type="url"
                                                        name="whatsapp"
                                                        value={formData.whatsapp}
                                                        onChange={handleChange}
                                                        placeholder="https://whatsapp.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">X (Twitter)</label>
                                                    <input
                                                        type="url"
                                                        name="x"
                                                        value={formData.x}
                                                        onChange={handleChange}
                                                        placeholder="https://x.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Discord</label>
                                                    <input
                                                        type="url"
                                                        name="discord"
                                                        value={formData.discord}
                                                        onChange={handleChange}
                                                        placeholder="https://discord.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div className="col-span-full">
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Registration Link *</label>
                                                    <input
                                                        type="url"
                                                        name="registrationLink"
                                                        value={formData.registrationLink}
                                                        onChange={handleChange}
                                                        placeholder="https://..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Event Materials */}
                                        <div className="space-y-6">
                                            <div className="h-px bg-white/10"></div>
                                            <h3 className="text-xl font-bold">Additional Event Materials</h3>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-400 mb-2">Event Brochure Link</label>
                                                <input
                                                    type="url"
                                                    name="brochureLink"
                                                    value={formData.brochureLink}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/brochure.pdf"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                />
                                                <p className="text-[10px] text-slate-500 mt-2 ml-1">Provide a link to the event brochure (PDF, Google Drive, etc.)</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        {/* Registration & Payment */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold">Registration & Payment</h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-4">Registration Type *</label>
                                                    <div className="flex gap-4">
                                                        {['Free', 'Paid'].map((type) => (
                                                            <label
                                                                key={type}
                                                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all cursor-pointer ${formData.registrationType === type ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="registrationType"
                                                                    value={type}
                                                                    checked={formData.registrationType === type}
                                                                    onChange={handleChange}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.registrationType === type ? 'border-sky-500' : 'border-slate-600'}`}>
                                                                    {formData.registrationType === type && <div className="w-2 h-2 bg-sky-500 rounded-full"></div>}
                                                                </div>
                                                                <span className="font-bold">{type}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {formData.registrationType === 'Paid' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <label className="block text-sm font-bold text-slate-400 mb-2">Entry Fee (INR)</label>
                                                        <input
                                                            type="number"
                                                            name="entryFee"
                                                            value={formData.entryFee}
                                                            onChange={handleChange}
                                                            placeholder="Amount in ₹"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all"
                                                        />
                                                    </motion.div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-bold text-slate-400 mb-2">Registration Link *</label>
                                                    <input
                                                        type="url"
                                                        name="registrationLink"
                                                        value={formData.registrationLink}
                                                        onChange={handleChange}
                                                        placeholder="https://registration.example.com"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* FAQs Section */}
                                        <div className="space-y-6">
                                            <div className="h-px bg-white/10"></div>
                                            <h3 className="text-xl font-bold">FAQs</h3>
                                            <div className="space-y-4">
                                                {formData.faqs.map((faq, index) => (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start bg-white/[0.02] p-4 rounded-2xl border border-white/5 relative group">
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-2">Question</label>
                                                            <input
                                                                type="text"
                                                                value={faq.question}
                                                                onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                                                placeholder="Enter question"
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <label className="block text-xs font-bold text-slate-500 mb-2">Answer</label>
                                                            <input
                                                                type="text"
                                                                value={faq.answer}
                                                                onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                                                                placeholder="Enter answer"
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-600"
                                                            />
                                                            {formData.faqs.length > 1 && (
                                                                <button
                                                                    onClick={() => removeFAQ(index)}
                                                                    className="absolute -top-1 -right-1 p-1 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                                >
                                                                    <AlertCircle size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addFAQ}
                                                    className="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all flex items-center gap-2 text-sm font-bold"
                                                >
                                                    <Sparkles size={16} /> Add FAQ
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-8 text-center"
                                    >
                                        <div className="py-12 flex flex-col items-center justify-center space-y-6">
                                            <div className="w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 animate-pulse">
                                                <Target size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black mb-2">Ready to Create?</h3>
                                                <p className="text-slate-400 max-w-md mx-auto">Double check all sections. Once launched, your event will undergo a quick review process.</p>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-sky-500/10 border border-sky-500/20 rounded-3xl text-left">
                                            <div className="flex gap-4">
                                                <Info className="text-sky-400 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="text-white font-bold mb-1">Final Review Required</p>
                                                    <p className="text-slate-400 leading-relaxed">By submitting, you agree to our community guidelines. Your event will be processed through our moderation system before appearing in the public feed.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Control Bar */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex gap-3 w-full md:w-auto order-2 md:order-1">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 md:flex-none px-6 py-4 bg-white/5 text-slate-300 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                    )}
                                </div>
                                <div className="w-full md:w-auto order-1 md:order-2">
                                    {step < 5 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-full md:px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-sky-400 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                                        >
                                            Next Stage <ChevronRight size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:px-12 py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : <><Upload size={18} /> Launch Event</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
