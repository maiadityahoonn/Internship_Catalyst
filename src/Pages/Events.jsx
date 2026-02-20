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
import { getDirectDriveLink } from '../utils/imageUtils';

export default function Events() {
  // State management
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Fetch Events from Firestore
  useEffect(() => {
    setLoading(true);
    setError(null); // Clear previous errors
    // Filter by status: 'approved' at the query level for security and efficiency
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

  // Filter Logic (Search and Category)
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

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'hackathon': return <Trophy className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'webinar': return <Video className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      <SEO title="Events" />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HERO SECTION */}
        <div className="relative mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-glow">
              <Calendar className="w-4 h-4" /> Elite Tech Events
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Next-Gen </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Tech Events</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Join elite hackathons, workshops, and conferences. Level up your skills and connect with the global tech community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            </div>
          </motion.div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="sticky top-20 md:top-24 z-40 mb-16 px-2">
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
                  className="px-4 py-2 text-rose-400 hover:text-rose-300 text-xs font-black uppercase tracking-widest transition-colors"
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Category</label>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Status</label>
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
                    <button onClick={() => setShowMobileFilters(false)} className="flex-1 p-3 bg-sky-500 text-black rounded-xl font-black text-sm uppercase tracking-widest">Apply</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
              {error.includes('index')
                ? "The database requires an index to sort events by date. Please click the link in your console to create it."
                : error}
            </p>
            {error.includes('index') && (
              <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 text-sm font-bold">
                Manual Action Required: Check browser console for the Firebase index creation link.
              </div>
            )}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-white/5 rounded-[3rem] backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No events found</h3>
            <p className="text-slate-400">Try adjusting your filters or stay tuned for updates.</p>
            <p className="text-sky-400/60 text-xs mt-6 font-medium italic">
              Note: New events require admin approval before they appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((event) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                          src={getDirectDriveLink(event.posterLink)}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-6 px-4 py-1.5 rounded-full bg-sky-500 text-black text-[10px] font-black tracking-widest uppercase">
                        {event.category || 'General'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-grow space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                          {event.title}
                        </h2>
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4">
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
                      </div>

                      <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Registration Open</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
}
