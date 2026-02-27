import { db } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from 'firebase/firestore';

/**
 * AI Monetization Utility
 * Handles Firestore-based purchases and 3-month access protocol.
 */

const ACCESS_DURATION_DAYS = 90;

// LIVE MODE: Paid access enabled
export const PRICING = {
    'ats-checker': { actual: 699, sale: 199 },
    'skill-gap': { actual: 499, sale: 149 },
    'cover-letter': { actual: 499, sale: 149 },
    'ai-resume': { actual: 0, sale: 0 } // Always free
};

export const AI_TOOLS = [
    {
        id: "ai-resume",
        title: "AI Resume Builder",
        description: "Easily make a professional resume that gets you hired.",
        path: "/ai-resume-templates",
        features: ["Easy to Use", "Fast Results", "Job Ready"],
        detailedFeatures: [
            "10+ Premium Resume Templates",
            "AI-Powered Content Generation",
            "One-Click PDF Export",
            "Applicant Tracking System Optimized",
            "Section-wise Expert Guidance"
        ],
        whyUse: "Our AI Resume Builder uses the same logic as top-tier HR software. It doesn't just format text; it architecturally positions your skills to be scanned and prioritized by hiring managers.",
        targetAudience: "Best for Freshers and Students looking for their first internship.",
        color: "from-sky-500/20 to-blue-500/20",
        accent: "sky",
        iconName: "Bot"
    },
    {
        id: "ats-checker",
        title: "ATS Score Checker",
        description: "Check if your resume can pass company software filters.",
        path: "/ats-score-checker",
        features: ["Score Card", "Fix Mistakes", "Keyword Tips"],
        detailedFeatures: [
            "Deep Keyword Gap Analysis",
            "Formatting & Parsing Validation",
            "Industry Benchmarking Score",
            "Actionable Fix Recommendations",
            "Role-Specific Optimization"
        ],
        whyUse: "90% of resumes are rejected by software before a human even sees them. Our ATS Checker reverse-engineers these filters to give you a clear score and exact steps to pass the 'bot' filter.",
        targetAudience: "Essential for students applying to MNCs and competitive Tech companies.",
        color: "from-indigo-500/20 to-purple-500/20",
        accent: "indigo",
        iconName: "Target"
    },
    {
        id: "skill-gap",
        title: "Skill Gap Analyzer",
        description: "Find out what skills you need to learn for your dream job.",
        path: "/skill-gap-analyzer",
        features: ["Skill Check", "Learn Plan", "Job Goals"],
        detailedFeatures: [
            "Custom Learning Roadmap (12 Weeks)",
            "Priority-Based Skill Ranking",
            "Project Recommendation Engine",
            "Week-by-Week Goal Setting",
            "Current vs Market Match Score"
        ],
        whyUse: "Stop guessing what to learn. Our analyzer compares your current profile with thousands of job descriptions from top startups to create a calculated path to employability.",
        targetAudience: "Designed for students who want to switch domains or level up their technical stack.",
        color: "from-purple-500/20 to-pink-500/20",
        accent: "purple",
        iconName: "Lightbulb"
    },
    {
        id: "cover-letter",
        title: "AI Cover Letter",
        description: "Write perfect application letters to impress companies.",
        path: "/cover-letter-ai",
        features: ["Match Job", "Pro Tone", "Save Time"],
        detailedFeatures: [
            "Context-Aware Content Generation",
            "Multiple Professional Tones",
            "Job Description Integration",
            "Recruiter-Proven Templates",
            "Unlimited Variations"
        ],
        whyUse: "A generic cover letter is a missed opportunity. Our AI analyzes the Job Description and your Resume to craft a narrative that bridges the gap, making you look like the perfect candidate.",
        targetAudience: "Perfect for students applying for specific, high-priority roles.",
        color: "from-emerald-500/20 to-teal-500/20",
        accent: "emerald",
        iconName: "Zap"
    }
];

/**
 * Checks if a specific tool is purchased and still active.
 * @param {string} userId - Current user ID
 * @param {string} toolId - Tool identifier
 */
export const isToolPurchased = async (userId, toolId) => {
    if (!userId) return false;
    if (PRICING[toolId]?.sale === 0) return true; // Always free tools

    try {
        const docRef = doc(db, 'users', userId, 'ai_purchases', toolId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const expiresAt = data.expiresAt?.toDate();

            // Check if purchase is still within 3-month window
            if (expiresAt && expiresAt > new Date()) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking purchase status:", error);
        return false;
    }
};

/**
 * Records a successful purchase in Firestore.
 * @param {string} userId 
 * @param {string} toolId 
 * @param {string} paymentId 
 */
export const recordPurchase = async (userId, toolId, paymentId) => {
    if (!userId) return false;

    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + ACCESS_DURATION_DAYS);

        // Record in User's Private Collection
        const purchaseRef = doc(db, 'users', userId, 'ai_purchases', toolId);
        await setDoc(purchaseRef, {
            toolId,
            paymentId,
            purchasedAt: serverTimestamp(),
            expiresAt: expiresAt,
            status: 'active'
        });

        // Record in Global Payments Log (for Admin)
        await addDoc(collection(db, 'payments'), {
            userId,
            toolId,
            paymentId,
            amount: PRICING[toolId]?.sale || 0,
            timestamp: serverTimestamp(),
            type: 'ai_tool'
        });

        return true;
    } catch (error) {
        console.error("Error recording purchase:", error);
        return false;
    }
};

/**
 * Gets active purchases for a user.
 */
export const getActiveTools = async (userId) => {
    if (!userId) return [];

    try {
        const purchasesRef = collection(db, 'users', userId, 'ai_purchases');
        const querySnap = await getDocs(purchasesRef);

        const tools = [];
        querySnap.forEach(doc => {
            const data = doc.data();
            const expiresAt = data.expiresAt?.toDate();
            if (!expiresAt || expiresAt > new Date()) {
                tools.push(data.toolId);
            }
        });

        return tools;
    } catch (error) {
        console.error("Error getting active tools:", error);
        return [];
    }
};

/**
 * Gets the purchase history for a user from Firestore.
 * @param {string} userId 
 */
export const getPurchaseHistory = async (userId) => {
    if (!userId) return [];

    try {
        const purchasesRef = collection(db, 'users', userId, 'ai_purchases');
        const querySnap = await getDocs(purchasesRef);

        const history = [];
        querySnap.forEach(doc => {
            history.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by date (newest first)
        return history.sort((a, b) => {
            const dateA = a.purchasedAt?.toDate() || 0;
            const dateB = b.purchasedAt?.toDate() || 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error getting purchase history:", error);
        return [];
    }
};
