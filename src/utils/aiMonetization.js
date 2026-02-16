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

export const PRICING = {
    'ats-checker': { actual: 699, sale: 149 },
    'skill-gap': { actual: 499, sale: 49 },
    'cover-letter': { actual: 499, sale: 79 },
    'ai-resume': { actual: 0, sale: 0 } // Always free
};

/**
 * Checks if a specific tool is purchased and still active.
 * @param {string} userId - Current user ID
 * @param {string} toolId - Tool identifier
 */
export const isToolPurchased = async (userId, toolId) => {
    if (!userId) return false;
    if (toolId === 'ai-resume') return true;

    try {
        const purchaseRef = doc(db, 'users', userId, 'ai_purchases', toolId);
        const purchaseSnap = await getDoc(purchaseRef);

        if (purchaseSnap.exists()) {
            const data = purchaseSnap.data();
            const expiresAt = data.expiresAt?.toDate();

            // If expired, access revoked
            if (expiresAt && expiresAt < new Date()) {
                return false;
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking tool access:", error);
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
