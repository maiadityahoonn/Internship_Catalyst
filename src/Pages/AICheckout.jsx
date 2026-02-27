import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import {
    CreditCard,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Info,
    Calendar,
    BadgeCheck,
    Sparkles,
    Lock
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { AI_TOOLS, PRICING, recordPurchase } from '../utils/aiMonetization';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
};

export default function AICheckout() {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tool, setTool] = useState(null);

    useEffect(() => {
        const foundTool = AI_TOOLS.find(t => t.id === toolId);
        if (!foundTool) {
            navigate('/ai');
            return;
        }

        setTool({
            ...foundTool,
            price: PRICING[foundTool.id].sale,
            actualPrice: PRICING[foundTool.id].actual,
            icon: React.createElement(LucideIcons[foundTool.iconName] || LucideIcons.Bot, { size: 32 })
        });

        // Load Razorpay
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, [toolId, navigate]);

    const handlePayment = async () => {
        if (!auth.currentUser) return;
        setLoading(true);

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: tool.price * 100,
            currency: "INR",
            name: "Internship Catalyst",
            description: `90 Days Access to ${tool.title}`,
            image: "https://internshipcatalyst.com/logo-og.png",
            handler: async (response) => {
                const success = await recordPurchase(
                    auth.currentUser.uid,
                    tool.id,
                    response.razorpay_payment_id
                );

                if (success) {
                    navigate(tool.path);
                } else {
                    alert("Something went wrong. Please contact support.");
                    setLoading(false);
                }
            },
            prefill: {
                name: auth.currentUser.displayName || "",
                email: auth.currentUser.email || ""
            },
            theme: {
                color: "#0ea5e9"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
    };

    if (!tool) return null;

    return (
        <MainLayout noContainer={true}>
            <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 font-sans pb-24 relative overflow-hidden">

                {/* 🌌 Background Decor */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/10 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 sm:pt-24 md:pt-32">

                    <button
                        onClick={() => navigate('/ai')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Back to AI Hub</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left Side: Info */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                                    {tool.icon}
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{tool.title}</h1>
                                    <p className="text-sky-500 text-[10px] font-black tracking-[0.3em] uppercase mt-1">Professional License</p>
                                </div>
                            </motion.div>

                            <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed mb-6 max-w-lg">
                                {tool.description}
                            </motion.p>

                            <motion.div variants={fadeInUp} className="p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10 mb-12 max-w-lg">
                                <div className="flex gap-3 text-sky-400 mb-3">
                                    <Sparkles size={18} />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Why use this?</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                                    "{tool.whyUse}"
                                </p>
                            </motion.div>

                            <motion.h4 variants={fadeInUp} className="text-[10px] font-black text-white tracking-[0.3em] uppercase mb-6">What you get</motion.h4>
                            <motion.div variants={fadeInUp} className="space-y-4 mb-12">
                                {(tool.detailedFeatures || tool.features).map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-emerald-400" />
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{feature}</span>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.div variants={fadeInUp} className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 mb-12 max-w-lg">
                                <div className="flex gap-3 text-indigo-400 mb-2">
                                    <Zap size={16} />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Is this for you?</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold">
                                    {tool.targetAudience}
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                                    <Calendar className="text-sky-500 mb-3" size={20} />
                                    <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mb-1">Duration</p>
                                    <p className="text-lg font-black tracking-tight">90 Days Access</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                                    <BadgeCheck className="text-sky-500 mb-3" size={20} />
                                    <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mb-1">Certificate</p>
                                    <p className="text-lg font-black tracking-tight">Verified Skills</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Side: Checkout Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="sticky top-32"
                        >
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-[3rem] blur opacity-20"></div>
                                <div className="relative bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-12 overflow-hidden">

                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <p className="text-[10px] font-black text-sky-500 tracking-widest uppercase mb-2">Total Payable</p>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-5xl font-black tracking-tighter">₹{tool.price}</span>
                                                <span className="text-lg font-bold text-slate-500 line-through tracking-tighter">₹{tool.actualPrice}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black tracking-widest">
                                            {Math.round(((tool.actualPrice - tool.price) / tool.actualPrice) * 100)}% OFF
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-12">
                                        <div className="flex justify-between py-4 border-b border-white/5">
                                            <span className="text-xs font-bold text-slate-400">Subscription Term</span>
                                            <span className="text-xs font-black">3 Months</span>
                                        </div>
                                        <div className="flex justify-between py-4 border-b border-white/5">
                                            <span className="text-xs font-bold text-slate-400">Taxes & Charges</span>
                                            <span className="text-xs font-black text-emerald-400">Included</span>
                                        </div>
                                        <div className="flex justify-between py-4">
                                            <span className="text-sm font-black text-white">Final Amount</span>
                                            <span className="text-sm font-black text-sky-500">₹{tool.price}.00</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full py-5 rounded-[2rem] bg-white text-black font-black tracking-[0.2em] text-[10px] uppercase shadow-2xl hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <CreditCard size={18} /> Pay & Unlock Now
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-8 flex flex-col items-center gap-6">
                                        <div className="flex items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                            <img src="https://razorpay.com/assets/razorpay-logo-white.svg" alt="Razorpay" className="h-4" />
                                            <div className="h-4 w-px bg-white/20"></div>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={14} />
                                                <span className="text-[8px] font-black tracking-widest uppercase">Secure SSL Encryption</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest uppercase text-slate-500">
                                            <Lock size={10} className="text-amber-500" /> Safe & Secure Payments
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 pt-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        <div className="flex gap-4">
                            <Zap className="text-sky-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-black tracking-tight mb-2">Instant Activation</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Tools are unlocked automatically right after successful payment verification.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Info className="text-sky-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-black tracking-tight mb-2">3-Month Strategy</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">90 days of full access gives you enough time to perfect your profile for any season.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Sparkles className="text-sky-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-black tracking-tight mb-2">Premium Support</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Dedicated assistance for any issues regarding your AI tool access or results.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
