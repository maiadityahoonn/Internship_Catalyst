/**
 * Converts a standard Google Drive sharing link into a direct link that can be used in <img> tags.
 * Supports /file/d/ID/view and ?id=ID formats.
 * 
 * @param {string} url - The Google Drive URL
 * @returns {string} - The direct image link or the original URL if no ID is found
 */
export const getDirectDriveLink = (url) => {
    if (!url || typeof url !== 'string') return url;

    // Check if it's a google drive link
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        let fileId = '';

        // Extract ID using regex - more robust
        // Catches /file/d/ID/... , /d/ID/... , and ?id=ID
        const idRegex = /(?:\/file\/d\/|\/d\/|id=)([a-zA-Z0-9_-]{25,})/;
        const match = url.match(idRegex);

        if (match && match[1]) {
            fileId = match[1];
        }

        if (fileId) {
            // thumbnail endpoint is often more reliable for direct display in <img> tags
            // and supports size parameter (sz=w1600 is plenty for posters)
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
        }
    }

    return url;
};
