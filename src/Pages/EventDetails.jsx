import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
    Calendar, MapPin, Globe, Users, Trophy, Gift,
    Link as LinkIcon, Instagram, Linkedin, MessageCircle,
    Share2, ArrowLeft, ExternalLink, Info, CheckCircle,
    Phone, Mail, User, Clock, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDirectPosterURL = (url) => {
        if (!url) return '';
        // Handle Google Drive links
        if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
            const idMatch = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
            if (idMatch && idMatch[1]) {
                // Return direct viewing link
                return `https://docs.google.com/uc?export=view&id=${idMatch[1]}`;
            }
        }
        return url;
    };

    const fetchEvent = async () => {
        if (!id) {
            console.warn("No ID found in params");
            return;
        }

        try {
            setLoading(true);
            const docRef = doc(db, 'events', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("No such document for ID:", id);
                setError("Event not found");
            }
        } catch (err) {
            console.error("Error fetching event:", err);
            setError("Failed to load event details");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: event?.title || 'Check out this event!',
            text: event?.description?.substring(0, 100) + '...',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium">Loading Event Details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/20">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white">{error || "Event Missing"}</h2>
                    <p className="text-slate-400">The event you are looking for might have been moved or deleted.</p>
                    <Link to="/events" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-sky-400 transition-all">
                        <ArrowLeft size={18} /> Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 overflow-x-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold tracking-widest text-xs uppercase">Back to Events</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Hero & Sections */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Header Section */}
                        <div className="relative group">
                            <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                                {event.posterLink ? (
                                    <img src={getDirectPosterURL(event.posterLink)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
                                        <Calendar className="w-20 h-20 text-white/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>

                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className="px-5 py-1.5 bg-sky-500 text-black text-[10px] font-black tracking-widest uppercase rounded-full">
                                            {event.category}
                                        </span>
                                        <span className="px-5 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
                                            {event.type}
                                        </span>
                                        {event.teamSize && (
                                            <span className="px-5 py-1.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2">
                                                <Users size={12} /> {event.teamSize} Member Team
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-2xl">{event.title}</h1>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-sky-500 rounded-full"></span>
                                About the Event
                            </h3>
                            <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {event.description}
                            </p>
                        </section>

                        {/* Event Schedule & Mode */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                    <Calendar className="text-sky-400" size={20} />
                                    Event Schedule
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                        <span className="text-slate-500 text-xs font-black uppercase">Starts</span>
                                        <span className="text-white font-bold">{new Date(event.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                        <span className="text-slate-500 text-xs font-black uppercase">Ends</span>
                                        <span className="text-white font-bold">{event.endDate ? new Date(event.endDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Ongoing'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-sky-500/10 p-4 rounded-2xl border border-sky-500/20">
                                        <span className="text-sky-400 text-[10px] font-black uppercase">Register By</span>
                                        <span className="text-sky-500 font-black">{new Date(event.registerByDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                    <Globe className="text-indigo-400" size={20} />
                                    Location & Mode
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Environment</p>
                                            <p className="text-white font-bold">{event.mode} • {event.country}</p>
                                        </div>
                                    </div>
                                    {event.detailedLocation && (
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Detailed Address</p>
                                            <p className="text-xs text-slate-300 leading-relaxed italic">"{event.detailedLocation}"</p>
                                        </div>
                                    )}
                                    {event.googleMapsLink && (
                                        <a
                                            href={event.googleMapsLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black font-bold rounded-2xl text-center transition-all border border-white/10"
                                        >
                                            View on Google Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Rewards & Perks */}
                        {(event.prizes || (event.perks && event.perks.length > 0)) && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {event.prizes && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                            <Trophy className="text-yellow-400" size={20} />
                                            Victory Rewards
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                                            {event.prizes}
                                        </p>
                                    </div>
                                )}
                                {event.perks && event.perks.length > 0 && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                            <Gift className="text-rose-400" size={20} />
                                            Participation Perks
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {event.perks.map((perk, i) => (
                                                <span key={i} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
                                                    {perk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}


                        {/* Winner Special Rewards [NEW] */}
                        {event.hasWinnerRewards && (event.winnerPrizes || event.winnerTrophy || event.winnerGoodies) && (
                            <section className="bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                    <Trophy className="text-amber-400" size={24} />
                                    Winner Special Rewards
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {event.winnerPrizes && (
                                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                                <DollarSign size={24} />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cash Prize</p>
                                            <p className="text-white font-bold">{event.winnerPrizes}</p>
                                        </div>
                                    )}
                                    {event.winnerTrophy && (
                                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all group">
                                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                                <Trophy size={24} />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Trophy / Medal</p>
                                            <p className="text-white font-bold">{event.winnerTrophy}</p>
                                        </div>
                                    )}
                                    {event.winnerGoodies && (
                                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-rose-500/30 transition-all group">
                                            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                                                <Gift size={24} />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Goodies / Swag</p>
                                            <p className="text-white font-bold">{event.winnerGoodies}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* FAQs */}
                        {event.faqs && event.faqs.length > 0 && (
                            <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
                                    Frequently Asked Questions
                                </h3>
                                <div className="space-y-6">
                                    {event.faqs.map((faq, idx) => (
                                        <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-sky-500/30 transition-all">
                                            <p className="text-white font-black mb-3 flex items-center gap-3">
                                                <Sparkles size={16} className="text-sky-400" /> {faq.question}
                                            </p>
                                            <p className="text-slate-400 font-medium leading-relaxed pl-7">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Actions & Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-18 h-fit">
                        {/* Registration Card */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${event.registrationType === 'Free' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                    {event.registrationType} Registration
                                </span>
                                {event.registrationType === 'Paid' && (
                                    <span className="text-2xl font-black text-white">₹{event.entryFee}</span>
                                )}
                            </div>

                            {event.pricingDetails && (
                                <div className="mb-6 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Info size={12} /> Pricing Note
                                    </p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{event.pricingDetails}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="col-span-1 py-4 bg-gradient-to-r from-sky-400 to-indigo-600 text-white font-black text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Register <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={handleShare}
                                    className="col-span-1 py-4 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                                >
                                    Share <Share2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/5">
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Certification Details</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">For Winners</span>
                                            <span className="text-white font-black text-xs">{event.certificateWinners}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">For Participants</span>
                                            <span className="text-white font-black text-xs">{event.certificateParticipants}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                                        <Globe size={18} />
                                    </div>
                                    <div className="flex flex-wrap gap-5">
                                        {event.websiteLink && <a href={event.websiteLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Website"><Globe size={18} /></a>}
                                        {event.instagram && <a href={event.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Instagram"><Instagram size={18} /></a>}
                                        {event.linkedin && <a href={event.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="LinkedIn"><Linkedin size={18} /></a>}
                                        {event.whatsapp && <a href={event.whatsapp} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="WhatsApp"><MessageCircle size={18} /></a>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Card */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                            <h3 className="text-xs font-black text-sky-400 uppercase tracking-[0.2em] mb-8">Organizer Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                        <User className="text-slate-500 w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-black truncate">{event.organizerName}</h4>
                                        <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest">{event.organizerDesignation}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Mail size={14} className="text-sky-400 shrink-0" /> <span className="truncate">{event.organizerEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Phone size={14} className="text-indigo-400 shrink-0" /> <span>{event.organizerPhone}</span>
                                    </div>
                                </div>
                                {event.contactInfo && (
                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Support Channel</p>
                                        <p className="text-white text-[11px] leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                                            "{event.contactInfo}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Brochure Link */}
                        {event.brochureLink && (
                            <div className="p-1 px-1 rounded-3xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20">
                                <a
                                    href={event.brochureLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-6 bg-[#020617] rounded-[1.4rem] hover:bg-transparent transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                            <Info size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">Event Brochure</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black">Download PDF</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
