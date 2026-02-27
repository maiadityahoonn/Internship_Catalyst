import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, canonical, image }) => {
    const location = useLocation();
    const baseUrl = "https://internshipcatalyst.com";
    const currentUrl = `${baseUrl}${location.pathname}`;
    const defaultDescription = "Internship Catalyst offers verified jobs, internships, professional skill courses, and AI-powered career tools to help students grow and get hired faster today.";
    const defaultKeywords = "Internship Catalyst, internships in india, student internships, freshers jobs, AI resume builder, ATS score checker, free online courses with certificates, career growth, skill development, placement preparation";
    const defaultImage = `${baseUrl}/logo.png`;

    useEffect(() => {
        // 1. Update Document Title
        const fullTitle = title ? `${title} | Internship Catalyst` : "Internship Catalyst";
        document.title = fullTitle;

        // Helper to update or create meta tags
        const updateMetaTag = (name, content, attr = 'name') => {
            if (!content) return;
            let tag = document.querySelector(`meta[${attr}="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attr, name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        // 2. Standard Meta Tags
        updateMetaTag('description', description || defaultDescription);
        updateMetaTag('keywords', keywords || defaultKeywords);
        updateMetaTag('author', 'Internship Catalyst');

        // 3. Open Graph Tags
        updateMetaTag('og:title', fullTitle, 'property');
        updateMetaTag('og:description', description || defaultDescription, 'property');
        updateMetaTag('og:url', currentUrl, 'property');
        updateMetaTag('og:image', image || defaultImage, 'property');
        updateMetaTag('og:type', 'website', 'property');

        // 4. Twitter Tags
        updateMetaTag('twitter:card', 'summary_large_image', 'name');
        updateMetaTag('twitter:title', fullTitle, 'name');
        updateMetaTag('twitter:description', description || defaultDescription, 'name');
        updateMetaTag('twitter:image', image || defaultImage, 'name');

        // 5. Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical || currentUrl);

        // 6. JSON-LD Structured Data
        const organizationData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Internship Catalyst",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
            "description": defaultDescription,
            "sameAs": [
                "https://www.linkedin.com/company/internshipcatalyst",
                "https://www.instagram.com/internshipcatalyst",
                "https://twitter.com/internshipcatalyst"
            ]
        };

        let orgScript = document.getElementById('json-ld-organization');
        if (!orgScript) {
            orgScript = document.createElement('script');
            orgScript.id = 'json-ld-organization';
            orgScript.type = 'application/ld+json';
            document.head.appendChild(orgScript);
        }
        orgScript.text = JSON.stringify(organizationData);

        const websiteData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Internship Catalyst",
            "url": baseUrl
        };

        let siteScript = document.getElementById('json-ld-website');
        if (!siteScript) {
            siteScript = document.createElement('script');
            siteScript.id = 'json-ld-website';
            siteScript.type = 'application/ld+json';
            document.head.appendChild(siteScript);
        }
        siteScript.text = JSON.stringify(websiteData);

    }, [title, description, keywords, canonical, image, currentUrl]);

    return null;
};

export default SEO;
