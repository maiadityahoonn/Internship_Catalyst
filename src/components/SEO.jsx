import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, canonical }) => {
    const location = useLocation();
    const baseUrl = "https://internshipcatalyst.com";
    const currentUrl = `${baseUrl}${location.pathname}`;

    useEffect(() => {
        // Update Document Title
        const fullTitle = title ? `${title} | Internship Catalyst` : "Internship Catalyst";
        document.title = fullTitle;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || "Internship Catalyst offers verified jobs, internships, professional skill courses, and AI-powered career tools to help students grow and get hired faster today.");
        }

        // Update Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || "internship, jobs, career, students, AI resume builder, ATS checker, internship catalyst");
        }

        // Update Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', canonical || currentUrl);
        }

        // Update OG Tags
        const updateOgTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (tag) tag.setAttribute('content', content);
        };

        updateOgTag('og:title', fullTitle);
        updateOgTag('og:description', description || "Internship Catalyst offers verified jobs, internships, professional skill courses, and AI-powered career tools to help students grow and get hired faster today.");
        updateOgTag('og:url', currentUrl);

        // Update Twitter Tags
        const updateTwitterTag = (name, content) => {
            let tag = document.querySelector(`meta[property="${name}"]`);
            if (tag) tag.setAttribute('content', content);
        };

        updateTwitterTag('twitter:title', fullTitle);
        updateTwitterTag('twitter:description', description || "Internship Catalyst offers verified jobs, internships, professional skill courses, and AI-powered career tools to help students grow and get hired faster today.");
        updateTwitterTag('twitter:url', currentUrl);

    }, [title, description, keywords, canonical, currentUrl]);

    return null;
};

export default SEO;
