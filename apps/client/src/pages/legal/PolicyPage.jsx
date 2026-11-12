import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Shield, Loader } from "react-feather";
import { API_BASE } from "../../config";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

// A premium lightweight custom markdown formatter for zero-dependency parsing
const formatMarkdown = (text) => {
    if (!text) return "";
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // H1 Heading
        if (trimmed.startsWith("# ")) {
            return (
                <h1 key={idx} className="text-2xl sm:text-3xl font-heading font-medium text-slate-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b pb-2 tracking-tight">
                    {trimmed.replace("# ", "")}
                </h1>
            );
        }
        
        // H2 Heading
        if (trimmed.startsWith("## ")) {
            return (
                <h2 key={idx} className="text-lg sm:text-xl md:text-2xl font-heading font-medium text-slate-800 mt-5 sm:mt-6 mb-2 sm:mb-3">
                    {trimmed.replace("## ", "")}
                </h2>
            );
        }

        // H3 Heading
        if (trimmed.startsWith("### ")) {
            return (
                <h3 key={idx} className="text-base sm:text-lg font-heading font-medium text-slate-800 mt-4 mb-2">
                    {trimmed.replace("### ", "")}
                </h3>
            );
        }
        
        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const rawContent = trimmed.substring(2);
            return (
                <li key={idx} className="ml-6 list-disc text-slate-600 text-sm sm:text-base mb-2 leading-relaxed">
                    {parseInlineStyles(rawContent)}
                </li>
            );
        }
        
        // Empty lines
        if (trimmed === "") {
            return <div key={idx} className="h-4" />;
        }
        
        // Paragraphs
        return (
            <p key={idx} className="text-slate-600 text-sm sm:text-base mb-4 leading-relaxed">
                {parseInlineStyles(trimmed)}
            </p>
        );
    });
};

// Parse bold **text** and general links in a lightweight manner
const parseInlineStyles = (text) => {
    const parts = [];
    let currentIndex = 0;
    
    // Simple regex for **bold**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
        // Add preceding text
        if (match.index > currentIndex) {
            parts.push(text.substring(currentIndex, match.index));
        }
        // Add bold part
        parts.push(
            <strong key={match.index} className="font-bold text-slate-900">
                {match[1]}
            </strong>
        );
        currentIndex = boldRegex.lastIndex;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
        parts.push(text.substring(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
};

const PolicyPage = () => {
    const { slug } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`${API_BASE}/settings/content-pages/${slug}`);
                if (!res.ok) throw new Error("Page not found");
                const data = await res.json();
                setPageData(data);
            } catch (err) {
                console.error("Failed to load policy:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Policy details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-6 text-center">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-2xl font-medium text-slate-800">Policy Page Not Found</h2>
                        <p className="text-slate-500 text-sm">We couldn't retrieve the policy document you requested. It might have been relocated or updated.</p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Homepage
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const currentContent = pageData.content?.en || "";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            <SEO 
                title={`${pageData.title} | FirstDoer`}
                description={`Read the official ${pageData.title} document for the FirstDoer platform.`}
            />
            <Navbar />

            {/* Content Body Container */}
            <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Page Header */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 border-b border-slate-100 bg-slate-50/50">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl font-heading font-medium text-slate-900 tracking-tight">
                                {pageData.title}
                            </h1>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Clock size={12} /> Updated: {new Date(pageData.updatedAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 text-[var(--color-primary)]"><Shield size={12} /> Verified Page</span>
                            </div>
                        </div>
                    </div>

                    {/* Policy Content View */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 prose prose-slate max-w-none text-sm sm:text-base leading-relaxed">
                        {currentContent.trim() ? (
                            formatMarkdown(currentContent)
                        ) : (
                            <p className="text-slate-400 text-center py-10 italic">
                                This policy content is not available yet.
                            </p>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PolicyPage;
