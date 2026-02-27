import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  ExternalLink,
  X,
  Tag,
  Plus,
  ArrowRight,
  Globe,
  Users,
  Trophy,
  Video,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageUtils';

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

export default function Events() {
  // State management
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Fetch Events from Firestore
  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(
      collection(db, 'events'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      data.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
      });

      setEvents(data);
      setLoading(false);
      setError(null);
    }, (error) => {
      console.error("Error fetching events:", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Logic
  const filteredEvents = events.filter(event => {
    const now = new Date();
    const startDate = event.startDate ? new Date(event.startDate) : null;
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    let eventStatus = 'upcoming';
    if (startDate && now > endDate) eventStatus = 'past';
    else if (startDate && now >= startDate && now <= endDate) eventStatus = 'ongoing';

    const matchesStatusLogic = status === 'all' || status === eventStatus;
    const matchesCategory = category === 'all' || event.category === category;
    const matchesSearch = searchTerm === '' ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch && matchesStatusLogic;
  });

  const clearFilters = () => {
    setCategory('all');
    setStatus('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      <SEO title="Events" />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HERO SECTION */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="relative mb-16 text-center"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold tracking-widest mb-6 shadow-glow">
              <Calendar className="w-4 h-4" /> Elite Tech Events
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Next-Gen </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Tech Events</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Join elite hackathons, workshops, and conferences. Level up your skills and connect with the global tech community.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/event/add"
              className="w-full sm:w-auto group px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-sky-400 transition-all shadow-xl shadow-white/5 hover:shadow-sky-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Host Your Event
            </Link>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              Browse Events <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* SEARCH & FILTERS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="sticky top-20 md:top-24 z-40 mb-16 px-2"
        >
          <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 md:p-2 shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-sky-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by Title, Tags..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); }}
                className="w-full bg-transparent border-none text-white focus:ring-0 py-3 pl-12 pr-4 text-base font-medium placeholder:text-slate-600"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-slate-300 text-sm font-bold focus:outline-none cursor-pointer hover:text-white transition-colors py-2 px-3 appearance-none"
              >
                <option value="all" className="bg-[#0f172a]">All Categories</option>
                <option value="hackathon" className="bg-[#0f172a]">Hackathons</option>
                <option value="workshop" className="bg-[#0f172a]">Workshops</option>
                <option value="webinar" className="bg-[#0f172a]">Webinars</option>
                <option value="competition" className="bg-[#0f172a]">Competitions</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent text-slate-300 text-sm font-bold focus:outline-none cursor-pointer hover:text-white transition-colors py-2 px-3 appearance-none"
              >
                <option value="all" className="bg-[#0f172a]">Status</option>
                <option value="upcoming" className="bg-[#0f172a]">Upcoming</option>
                <option value="ongoing" className="bg-[#0f172a]">Ongoing</option>
                <option value="past" className="bg-[#0f172a]">Past</option>
              </select>
              {(category !== 'all' || status !== 'all' || searchTerm !== '') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-rose-400 hover:text-rose-300 text-xs font-black tracking-widest transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-3 bg-white/5 rounded-xl text-white flex items-center justify-center"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 mt-2 shadow-xl mx-auto max-w-5xl"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black tracking-widest text-slate-500 mb-2 block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="hackathon">Hackathons</option>
                      <option value="workshop">Workshops</option>
                      <option value="webinar">Webinars</option>
                      <option value="competition">Competitions</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black tracking-widest text-slate-500 mb-2 block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-sm"
                    >
                      <option value="all">Any Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={clearFilters} className="flex-1 p-3 bg-rose-500/10 text-rose-400 rounded-xl font-bold text-sm">Clear Filters</button>
                    <button onClick={() => setShowMobileFilters(false)} className="flex-1 p-3 bg-sky-500 text-black rounded-xl font-black text-sm tracking-widest">Apply</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* EVENTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] h-[450px] animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-rose-950/20 border border-rose-500/20 rounded-[3rem] backdrop-blur-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Database Connection Issue</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {error}
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-white/5 rounded-[3rem] backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No events found</h3>
            <p className="text-slate-400">Try adjusting your filters or stay tuned for updates.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div
                layout
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                key={event.id}
                className="group relative bg-[#0B1120] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-sky-500/30 transition-all duration-500"
              >
                <Link to={`/event/${event.id}`} className="block h-full">
                  <div className="h-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-sky-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(14,165,233,0.1)] flex flex-col group-hover:-translate-y-2">
                    {/* Image Section */}
                    <div className="relative h-56 w-full overflow-hidden">
                      {event.posterLink ? (
                        <img
                          src={getOptimizedImageUrl(event.posterLink, { w: 800, h: 600 })}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-6 px-4 py-1.5 rounded-full bg-sky-500 text-black text-[10px] font-black tracking-widest">
                        {event.category || 'General'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-grow space-y-6">
                      <div className="space-y-3">
                        <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl font-black text-white group-hover:text-sky-400 transition-colors line-clamp-1 tracking-tight">
                          {event.title}
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-sm md:text-base text-slate-400 line-clamp-2 leading-relaxed font-medium">
                          {event.description}
                        </motion.p>
                      </div>

                      <motion.div variants={fadeInUp} className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="font-bold">
                            {event.startDate ? new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-bold truncate">{event.mode || 'Online'} • {event.country || 'Global'}</span>
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-emerald-400 tracking-widest">Registration Open</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
}
