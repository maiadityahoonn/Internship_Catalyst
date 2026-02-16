import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export default function Accordion({ title, icon, children, defaultOpen = false, className = "" }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`border border-white/5 rounded-2xl overflow-hidden bg-[#0F172A]/40 backdrop-blur-sm transition-colors hover:border-sky-500/20 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4 text-white">
                    <div className="p-2 rounded-lg bg-white/5 text-sky-400">
                        {icon}
                    </div>
                    <span className="font-bold text-lg tracking-wide">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                >
                    <FaChevronDown />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 border-t border-white/5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
