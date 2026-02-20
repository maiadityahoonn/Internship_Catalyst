import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import {
  Search,
  MapPin,
  Banknote,
  X,
  Briefcase,
  Building2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  Star,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Jobs() {
  // State management
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Adjusted for 3x3 grid

  // Filter states
  const [officeType, setOfficeType] = useState('all');
  const [minExperience, setMinExperience] = useState('');

  // Fetch Jobs from Firestore
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Subtle Sort: Featured first, then by date
      data.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
      });

      setJobs(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    const matchesOfficeType = officeType === 'all' || job.officeType === officeType;
    const matchesExperience = !minExperience || (job.experience && parseInt(job.experience) >= parseInt(minExperience));
    const matchesSearch = searchTerm === '' ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesOfficeType && matchesSearch && matchesExperience;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleApply = async (job) => {
    if (!auth.currentUser) {
      alert("Please login to apply for this job.");
      navigate('/auth');
      return;
    }

    try {
      // Save interaction to Firestore
      await addDoc(collection(db, 'user_interactions'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        type: 'job',
        itemId: job.id,
        itemTitle: job.title,
        itemCompany: job.company,
        itemLocation: job.location,
        itemLogo: job.logo,
        timestamp: serverTimestamp()
      });

      if (job.companyUrl) window.open(job.companyUrl, '_blank');
      else alert('Application link not available.');
    } catch (err) {
      console.error("Error saving interaction:", err);
      // Still open link even if tracking fails, to not block user
      if (job.companyUrl) window.open(job.companyUrl, '_blank');
    }
  };

  const clearFilters = () => {
    setOfficeType('all');
    setMinExperience('');
    setSearchTerm('');
    setCurrentPage(1); // Reset to page 1 on filter clear
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      <SEO title="Jobs" />

      <div className="max-w-7xl mx-auto">

        {/* 1. HERO SECTION (Header) */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.1)]">
              <Briefcase className="w-4 h-4" /> Top-Tier Careers
            </div>
          </motion.div>
          <h1 className="text-[2.25rem] sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Find Your </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Next Big Thing</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-light px-4">
            Curated opportunities with top-tier companies. Verified and ready for you.
          </p>
        </div>

        {/* 2. FILTER BAR */}
        <div className="sticky top-20 md:top-24 z-40 mb-12 px-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 md:p-2 shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-sky-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by Title, Company..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 py-3 pl-12 pr-4 text-base font-medium"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-2">
              <select
                value={officeType}
                onChange={(e) => { setOfficeType(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none cursor-pointer hover:text-white transition-colors py-2 px-2"
              >
                <option value="all" className="bg-[#0f172a]">Workplace</option>
                <option value="in-office" className="bg-[#0f172a]">In-Office</option>
                <option value="remote" className="bg-[#0f172a]">Remote</option>
                <option value="hybrid" className="bg-[#0f172a]">Hybrid</option>
              </select>
              <select
                value={minExperience}
                onChange={(e) => { setMinExperience(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none cursor-pointer hover:text-white transition-colors py-2 px-2"
              >
                <option value="" className="bg-[#0f172a]">Experience</option>
                <option value="0" className="bg-[#0f172a]">Fresher</option>
                <option value="1" className="bg-[#0f172a]">1+ Year</option>
                <option value="3" className="bg-[#0f172a]">3+ Years</option>
              </select>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-3 bg-white/5 rounded-xl text-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile Filters */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden bg-[#0f172a] border border-white/10 rounded-xl p-4 mt-2 shadow-xl mx-4"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Workplace</label>
                    <select
                      value={officeType}
                      onChange={(e) => { setOfficeType(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-sm"
                    >
                      <option value="all">Any Workplace</option>
                      <option value="in-office">In-Office</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Experience</label>
                    <select
                      value={minExperience}
                      onChange={(e) => { setMinExperience(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-sm"
                    >
                      <option value="">Any Experience</option>
                      <option value="0">Fresher</option>
                      <option value="1">1+ Year</option>
                      <option value="3">3+ Years</option>
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

        {/* 3. UNIQUE CARD GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-slate-900/50 rounded-3xl animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-slate-900/50 mb-4 border border-white/5">
              <Search className="text-4xl text-slate-600 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">No jobs found</h2>
            <p className="text-slate-500 mt-2">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-6 text-sky-400 font-bold hover:underline">Reset All</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentJobs.map((job) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                key={job.id}
                className="group relative bg-[#0B1120] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-sky-500/30 transition-colors duration-500"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Top Section */}
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#1e293b] flex items-center justify-center text-3xl shadow-inner border border-white/10 group-hover:shadow-sky-500/20 transition-all overflow-hidden">
                      {job.companyLogo ? (
                        <img
                          src={getOptimizedImageUrl(job.companyLogo, { w: 100, h: 100 })}
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="text-slate-400 group-hover:text-sky-400 transition-colors w-7 h-7" />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${job.officeType === 'remote' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' :
                        'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                        {job.officeType || 'Hybrid'}
                      </span>
                      {/* Date Removed per user request */}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-sky-400 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-2 mb-5">
                    <p className="text-slate-400 font-medium text-sm">{job.company}</p>
                    {job.isVerified && (
                      <span className="flex items-center gap-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Verified <BadgeCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                      <p className="text-xs text-slate-200 font-medium truncate">{job.location || 'Remote'}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><Banknote className="w-3 h-3" /> Salary</p>
                      <p className="text-xs text-emerald-400 font-medium truncate">{job.salary || 'Competitive'}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</p>
                      <p className="text-xs text-rose-400 font-medium truncate">{job.deadline || 'ASAP'}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Openings</p>
                      <p className="text-xs text-white font-medium truncate">{job.openings || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5 font-medium">
                        +{job.skills.length - 3} More
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar (Slide Up Effect) */}
                <div className="bg-[#0f172a] border-t border-white/5 p-3 flex gap-2 relative z-10">
                  <button
                    onClick={() => { setSelectedJobForDetails(job); setShowDetailsModal(true); }}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    className="flex-[2] py-2.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-sky-400 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    Apply Now <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 pb-8 gap-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full hidden md:flex items-center justify-center bg-[#0f172a] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-sky-500 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-12 h-12 rounded-full font-bold transition-all border ${currentPage === i + 1
                  ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-500/25 scale-110'
                  : 'bg-[#0f172a] border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-full hidden md:flex items-center justify-center bg-[#0f172a] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-sky-500 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Details Modal (Unchanged in Logic, slightly updated design) */}
      <AnimatePresence>
        {showDetailsModal && selectedJobForDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0B1120] border border-white/10 rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setShowDetailsModal(false)} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1e293b] flex items-center justify-center text-3xl sm:text-4xl border border-white/10 shrink-0 overflow-hidden">
                    {selectedJobForDetails.companyLogo ? (
                      <img
                        src={getOptimizedImageUrl(selectedJobForDetails.companyLogo, { w: 200, h: 200 })}
                        alt={selectedJobForDetails.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="text-sky-500 w-8 h-8 sm:w-10 sm:h-10" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{selectedJobForDetails.title}</h2>
                    <p className="text-lg sm:text-xl text-slate-400 font-medium">{selectedJobForDetails.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center gap-1"><Banknote className="w-3 h-3" /> Salary</p>
                    <p className="text-emerald-400 font-bold">{selectedJobForDetails.salary}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Experience</p>
                    <p className="text-white font-bold">{selectedJobForDetails.experience}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                    <p className="text-white font-bold truncate">{selectedJobForDetails.location}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</p>
                    <p className="text-rose-400 font-bold">{selectedJobForDetails.deadline || 'N/A'}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">About the Role</h3>
                <div className="prose prose-invert max-w-none mb-8 text-slate-300">
                  <p className="whitespace-pre-wrap leading-relaxed">{selectedJobForDetails.description}</p>
                </div>

                {selectedJobForDetails.skills && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobForDetails.skills.map((s, i) => (
                        <span key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleApply(selectedJobForDetails)}
                  className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:bg-sky-400 hover:scale-[1.01] transition-all shadow-xl shadow-white/5"
                >
                  Apply for this Position
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}