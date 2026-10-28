import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Check, Copy } from "react-feather";
import SEO from "../seo/SEO";
import { blogs } from "../../data/blogs";
import Footer from "../layout/Footer";

/* -------------------------------------------------------------------------- */
/*                         DESIGN SYSTEM COMPONENTS                           */
/* -------------------------------------------------------------------------- */

const Pill = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
    {children}
  </span>
);

const SectionHeading = ({ children }) => (
  <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 border-b border-[var(--color-border)] pb-2">
    {children}
  </h3>
);

const AuthorCard = ({ author, date }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[var(--color-border-subtle)] border border-[var(--color-border)] overflow-hidden">
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
        alt={`Avatar of ${author}`}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold text-[var(--color-text)] leading-tight">{author}</span>
      <time dateTime={date} className="text-xs font-medium text-[var(--color-text-muted)]">{date}</time>
    </div>
  </div>
);

const Callout = ({ children }) => (
  <div className="my-8 p-5 rounded-xl bg-[var(--color-primary-subtle)] border-l-4 border-[var(--color-primary)]">
    <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)] mb-2 uppercase tracking-wide">
      <Check size={14} className="text-[var(--color-primary)]" strokeWidth={3} />
      Key Highlight
    </h4>
    <div className="text-[var(--color-text-muted)] font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                MAIN SCREEN                                 */
/* -------------------------------------------------------------------------- */

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Use static data lookup
    const found = blogs.find(p => p._id === id);

    if (found) {
      setPost(found);
      const words = found.description?.split(/\s+/).length || 0;
      setReadingTime(Math.ceil(words / 225));
      setLoading(false);
    } else {
      setError("We couldn't find that article.");
      setLoading(false);
    }
  }, [id]);

  const formattedDate = useMemo(() => post?.date ? new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "", [post]);

  if (loading || error) return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
      {!loading && error && (
        <SEO
          title="Article Not Found"
          description="The requested blog article was not found. Return to OnIT INDIA blog for more insights on task execution and the future of work."
          noindex
        />
      )}
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Loading article</p>
        </div>
      ) : (
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">{error}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">The article may have been moved or removed.</p>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Back to Journal
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      {post && (
        <SEO
          title={post.title}
          description={post.description}
          image={post.image}
          keywords={post.keywords ? post.keywords.join(", ") : "onitindia, OnIT INDIA blog, article"}
          canonical={`https://www.onitindia.com/blog/${post._id}`}
          type="article"
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "datePublished": post.date,
            "publisher": {
              "@type": "Organization",
              "name": "OnIT INDIA",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.onitindia.com/logo.png"
              }
            }
          }}
        />
      )}

      <main className="max-w-[1040px] mx-auto px-4 md:px-6 pt-5 sm:pt-6 md:pt-7 pb-12 md:pb-16 lg:pb-20">

        {/* HEADER GRID */}
        <header className="mb-8 md:mb-16">
          <div className="flex flex-col gap-4 md:gap-6 max-w-3xl">
            <button
              type="button"
              onClick={() => navigate("/blog")}
              className="group inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-2"
            >
              <span className="w-8 h-8 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors shadow-[var(--shadow-xs)]">
                <ArrowLeft size={14} />
              </span>
              Back to Journal
            </button>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Pill>{post.category}</Pill>
              <span className="text-[10px] md:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{readingTime} min read</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-[var(--color-text)]"
            >
              {post.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl font-medium"
            >
              {post.description?.split('.')[0]}.
            </motion.p>
          </div>
        </header>

        {/* HERO IMAGE */}
        <motion.figure
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="w-full aspect-[2/1] md:aspect-[21/9] bg-[var(--color-border-subtle)] rounded-xl overflow-hidden mb-10 md:mb-16 border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
        >
          <img
            src={post.image?.replace("/upload/", "/upload/f_auto,q_auto,w_1200/") || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7"}
            alt={post.title ? `Cover image for ${post.title}` : "Blog post cover image"}
            className="w-full h-full object-cover"
          />
        </motion.figure>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">

          {/* SIDEBAR (METADATA) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 h-fit space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="p-5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <SectionHeading>Written by</SectionHeading>
              <AuthorCard author={post.author} date={formattedDate} />
            </div>

            <div className="p-5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <SectionHeading>Share</SectionHeading>
              <div className="flex flex-col gap-2 items-start">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  <Copy size={14} /> Copy link
                </button>
              </div>
            </div>

            {post.keywords && post.keywords.length > 0 && (
              <div className="p-5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                <SectionHeading>Topics</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] md:text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-subtle)] px-2.5 py-1 rounded-lg border border-[var(--color-primary-muted)]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* MAIN CONTENT */}
          <article className="lg:col-span-9 lg:pl-12 order-1 lg:order-2">
            {/* Intro Paragraph */}
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none
                    prose-headings:text-[var(--color-text)] prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-[var(--color-text-muted)] prose-p:leading-8 prose-p:font-medium
                    prose-a:text-[var(--color-primary)] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
                    prose-img:rounded-xl prose-img:border prose-img:border-[var(--color-border)]
                 ">

              {/* Smart Content Rendering */}
              {(() => {
                if (!post.description) return null;

                // Identify a good callout sentence (short, impactful, usually early on)
                const sentences = post.description.match(/[^\.!\?]+[\.!\?]+/g) || [];
                const highlight = sentences.find(
                  (s) =>
                    s.length > 40 &&
                    s.length < 120 &&
                    (s.includes("OnIT INDIA") || s.includes("OnIT INDIA") || s.includes("lifesaver") || s.includes("empowering"))
                );

                const lines = post.description.split('\n').filter(line => line.trim() !== '');
                const elements = [];
                let listBuffer = [];

                let paragraphCount = 0;
                let imageIndex = 0;

                lines.forEach((line, index) => {
                  const trimmed = line.trim();
                  if (highlight && trimmed.includes(highlight.trim())) {
                    // Skip
                  }

                  // List Item detection
                  if (trimmed.startsWith('- ')) {
                    listBuffer.push(trimmed.substring(2));
                  } else {
                    // Flush List
                    if (listBuffer.length > 0) {
                      elements.push(
                        <ul key={`list-${index}`} className="my-6 md:my-8 space-y-3 md:space-y-4">
                          {listBuffer.map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-[var(--color-text-muted)]">
                              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                              <span className="leading-relaxed">{item.split(':')[0]}<span className="text-[var(--color-text)] font-semibold">{item.includes(':') ? ':' : ''}</span>{item.split(':').slice(1).join(':')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                      listBuffer = [];
                    }

                    // Header detection
                    const isHeader = trimmed.length < 80 && !trimmed.endsWith('.') && (trimmed.endsWith('?') || trimmed.includes("Benefits") || trimmed.includes("Why") || trimmed.includes("Join") || /^[A-Z][a-zA-Z\s]+$/.test(trimmed));

                    // Render
                    if (isHeader) {
                      elements.push(<h3 key={`h3-${index}`} className="text-xl md:text-2xl font-bold text-[var(--color-text)] mt-10 md:mt-14 mb-4 md:mb-5 tracking-tight">{trimmed}</h3>);
                    } else {
                      paragraphCount++;
                      elements.push(<p key={`p-${index}`} className="mb-4 md:mb-6 leading-7 md:leading-8 text-[var(--color-text-muted)]">{trimmed.replace(highlight || "xyz_impossible", "").trim() || trimmed}</p>);

                      if ((paragraphCount === 2 || paragraphCount === 5) && post.additionalImages && post.additionalImages[imageIndex]) {
                        elements.push(
                          <figure key={`img-${index}`} className="my-8 md:my-10 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                            <img
                              src={post.additionalImages[imageIndex].replace("/upload/", "/upload/f_auto,q_auto,w_1200/")}
                              alt={post.title ? `Image for ${post.title}` : "Article image"}
                              className="w-full h-[200px] md:h-[320px] object-cover"
                            />
                          </figure>
                        );
                        imageIndex++;
                      }
                    }
                  }
                });

                // Flush remaining list
                if (listBuffer.length > 0) {
                  elements.push(
                    <ul key={`list-end`} className="my-8 space-y-4">
                      {listBuffer.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-[var(--color-text-muted)]">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                          <span className="leading-relaxed"><strong className="text-[var(--color-text)]">{item.split(':')[0]}</strong>{item.includes(':') ? ':' : ''} {item.split(':').slice(1).join(':')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return elements;
              })()}
            </div>
            {/* Internal links */}
            <nav className="mt-12 pt-8 border-t border-[var(--color-border)]" aria-label="Explore OnIT INDIA">
              <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Explore OnIT INDIA</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <li><Link to="/" className="text-[var(--color-primary)] font-semibold hover:underline">Home</Link></li>
                <li><Link to="/what-is-onit-india" className="text-[var(--color-primary)] font-semibold hover:underline">What is OnIT INDIA</Link></li>
                <li><Link to="/how-it-works" className="text-[var(--color-primary)] font-semibold hover:underline">How it works</Link></li>
                <li><Link to="/task-performers" className="text-[var(--color-primary)] font-semibold hover:underline">For performers</Link></li>
                <li><Link to="/tasks" className="text-[var(--color-primary)] font-semibold hover:underline">Task categories</Link></li>
                <li><Link to="/blog" className="text-[var(--color-primary)] font-semibold hover:underline">Blog</Link></li>
              </ul>
            </nav>
          </article>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default BlogPost;
