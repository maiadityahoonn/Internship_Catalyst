/**
 * AI Monetization Utility
 * Handles simulated purchases and ownership checks using localStorage.
 */

const PURCHASES_KEY = 'ic_ai_purchases';

const getStoredPurchases = () => {
    try {
        const data = localStorage.getItem(PURCHASES_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Failed to parse purchases:", e);
        return {};
    }
};

const savePurchases = (purchases) => {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
};

/**
 * Checks if a specific tool is purchased.
 * @param {string} userId - Current user ID
 * @param {string} toolId - Tool identifier
 */
export const isToolPurchased = (userId, toolId) => {
    if (!userId) return false;
    // AI Resume tool is currently free/unlocked
    if (toolId === 'ai-resume') return true;

    const purchases = getStoredPurchases();
    return !!(purchases[userId] && purchases[userId][toolId]);
};

/**
 * Simulates a tool purchase.
 * @param {string} userId 
 * @param {string} toolId 
 * @param {string} toolName 
 * @param {number} price 
 */
export const purchaseTool = (userId, toolId, toolName, price) => {
    if (!userId) return false;

    const purchases = getStoredPurchases();
    if (!purchases[userId]) purchases[userId] = {};

    purchases[userId][toolId] = {
        purchasedAt: new Date().toISOString(),
        name: toolName,
        price: price,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    savePurchases(purchases);
    return true;
};

/**
 * Gets the purchase history for a user.
 * @param {string} userId 
 */
export const getPurchaseHistory = (userId) => {
    if (!userId) return [];
    const purchases = getStoredPurchases();
    const userPurchases = purchases[userId] || {};

    return Object.keys(userPurchases).map(id => ({
        id,
        ...userPurchases[id]
    })).sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
};

export const PRICING = {
    'ats-checker': 99,
    'skill-gap': 149,
    'cover-letter': 79
};
