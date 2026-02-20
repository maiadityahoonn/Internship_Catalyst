/**
 * Converts a standard Google Drive sharing link into a direct link that can be used in <img> tags.
 */
export const getDirectDriveLink = (url) => {
    if (!url || typeof url !== 'string') return url;

    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        const idRegex = /(?:\/file\/d\/|\/d\/|id=)([a-zA-Z0-9_-]{25,})/;
        const match = url.match(idRegex);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
        }
    }
    return url;
};

/**
 * Optimizes an ImageKit URL by appending transformation parameters.
 * @param {string} url - The base ImageKit URL
 * @param {object} options - { width, height, quality }
 */
export const optimizeImageKitUrl = (url, { w, h, q = 80 } = {}) => {
    if (!url || typeof url !== 'string' || !url.includes('ik.imagekit.io')) return url;

    // Check if there are already transformations
    const separator = url.includes('?') ? '&' : '?';
    let tr = `tr:q-${q}`;
    if (w) tr += `,w-${w}`;
    if (h) tr += `,h-${h}`;

    // Handle ImageKit's specific path structure or query params
    if (url.includes('tr:')) {
        return url.replace(/tr:[^/]+/, tr);
    }

    return `${url}${url.includes('?') ? '&' : '?'}${tr}`;
};

/**
 * Generic function to get an optimized image URL supporting both Drive and ImageKit.
 */
export const getOptimizedImageUrl = (url, options = {}) => {
    if (!url) return '';

    // 1. Handle Google Drive
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        return getDirectDriveLink(url);
    }

    // 2. Handle ImageKit
    if (url.includes('ik.imagekit.io')) {
        return optimizeImageKitUrl(url, options);
    }

    return url;
};
