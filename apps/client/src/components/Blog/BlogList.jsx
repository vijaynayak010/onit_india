import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../layout/Footer";
import SEO from "../seo/SEO";
import { Trash2, Search, ArrowUpRight, Clock, ChevronRight, BookOpen } from "react-feather";
import { blogs as staticBlogs } from "../../data/blogs";

/* -------------------------------------------------------------------------- */
/*                                  UTILS                                     */
/* -------------------------------------------------------------------------- */

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calculateReadingTime = (text) => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 225);
};

const cloudImg = (url) =>
  url?.includes("/upload/")
    ? url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/")
    : url;

/* Category metadata for structured section intros */
const CATEGORY_META = {
  "Future of Work": {
    title: "Future of Work",
    description: "How work is changing: task-based execution, execution marketplaces, and the infrastructure that connects demand with talent.",
  },
  "Startups": {
    title: "Startups",
    description: "Insights for founders and early-stage teams on execution, delegation, and using task platforms to move faster.",
  },
  "Earning": {
    title: "Earning",
    description: "Ways to earn from your skills: task-based income, side hustles, and flexible work in India.",
  },
  "Productivity": {
    title: "Productivity",
    description: "Delegation, outsourcing, and getting work done without losing quality or control.",
  },
  "Remote Work": {
    title: "Remote Work",
    description: "Remote work and task-based earning: guides and tips for working from anywhere in India.",
  },
  "Business": {
    title: "Business",
    description: "How businesses and professionals get work done: hiring help, one-off tasks, and task platforms.",
  },
  "Freelancing": {
    title: "Freelancing",
    description: "Freelance vs task-based work, gig economy, and choosing the right model for your goals.",
  },
  "Technology": {
    title: "Technology",
    description: "Technology and innovation — including AI — and how they shape work and daily life.",
  },
  "Community": {
    title: "Community",
    description: "Stories and impact from the OnIT INDIA community and the people who use the platform.",
  },
  "Lifestyle": {
    title: "Lifestyle",
    description: "Work-life balance, convenience, and how task platforms make daily life easier for families and professionals.",
  },
};

/* -------------------------------------------------------------------------- */
/*                                SKELETONS                                   */
/* -------------------------------------------------------------------------- */

const SkeletonHero = () => (
  <div className="w-full rounded-2xl bg-[var(--color-border-subtle)] p-8 md:p-12 animate-pulse flex flex-col md:flex-row gap-12 min-h-[420px]">
    <div className="flex-1 flex flex-col justify-center space-y-6">
      <div className="w-28 h-5 rounded-full bg-[var(--color-border)]" />
      <div className="w-full h-12 bg-[var(--color-border)] rounded-xl" />
      <div className="w-4/5 h-12 bg-[var(--color-border)] rounded-xl" />
      <div className="w-full h-20 bg-[var(--color-border)] rounded-xl mt-4" />
    </div>
    <div className="flex-1 bg-[var(--color-border)] rounded-xl h-64 md:h-auto min-h-[240px]" />
  </div>
);

const SkeletonCard = () => (
  <div className="flex flex-col space-y-4">
    <div className="aspect-[16/10] bg-[var(--color-border-subtle)] rounded-xl animate-pulse" />
    <div className="h-5 bg-[var(--color-border-subtle)] rounded w-3/4 animate-pulse" />
    <div className="h-4 bg-[var(--color-border-subtle)] rounded w-full animate-pulse" />
    <div className="h-4 bg-[var(--color-border-subtle)] rounded w-1/2 animate-pulse" />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

const CategorySectionIntro = ({ category }) => {
  const meta = CATEGORY_META[category];
  if (!meta) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 md:mb-10 p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
    >
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] tracking-tight mb-2">
        {meta.title}
      </h2>
      <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed max-w-2xl">
        {meta.description}
      </p>
      {meta.themes && meta.themes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Topics in this section
          </p>
          <ul className="flex flex-wrap gap-2">
            {meta.themes.map((theme, i) => (
              <li key={i}>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary-muted)]">
                  {theme}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className={`
      relative px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
      ${active
        ? "text-white shadow-[var(--shadow-sm)]"
        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
      }
    `}
  >
    {active && (
      <motion.div
        layoutId="blogActivePill"
        className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
    <span className="relative z-10">{label}</span>
  </button>
);

const SearchInput = ({ value, onChange }) => (
  <div className="relative w-full md:w-80 group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-[var(--color-text-subtle)] group-focus-within:text-[var(--color-primary)] transition-colors" />
    </div>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search articles..."
      aria-label="Search blog articles"
      className="
        block w-full pl-11 pr-4 py-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)]
        rounded-xl text-sm font-medium text-[var(--color-text)] placeholder-[var(--color-text-subtle)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
        transition-all duration-200
      "
    />
  </div>
);

const BlogCard = React.forwardRef(({ post, onClick, isAdmin, onDelete, index }, ref) => (
  <motion.article
    layout
    ref={ref}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.3, delay: index != null ? index * 0.05 : 0 }}
    whileHover={{ y: -4 }}
    className="group cursor-pointer flex flex-col h-full bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border)] transition-all duration-300"
    onClick={onClick}
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-border-subtle)]">
      <motion.img
        src={cloudImg(post.image)}
        alt={post.title ? `Featured image for ${post.title}` : "Blog post image"}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[var(--color-surface-elevated)]/95 backdrop-blur-sm text-[var(--color-text)] shadow-[var(--shadow-sm)]">
          {post.category}
        </span>
      </div>
    </div>

    <div className="flex flex-col flex-1 p-5 md:p-6">
      <div className="flex items-center gap-3 text-xs font-semibold text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" aria-hidden />
        <span className="flex items-center gap-1.5">
          <Clock size={12} aria-hidden /> {calculateReadingTime(post.description)} min read
        </span>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-[var(--color-text)] mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-3">
        {post.title}
      </h2>

      <p className="text-[var(--color-text-muted)] line-clamp-2 md:line-clamp-3 text-sm leading-relaxed flex-1">
        {post.description}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
            alt={`Avatar of ${post.author}`}
            className="w-9 h-9 rounded-full bg-[var(--color-border-subtle)] object-cover"
          />
          <span className="text-sm font-semibold text-[var(--color-text)]">{post.author}</span>
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={(e) => onDelete(e, post._id)}
            className="p-2 text-[var(--color-text-subtle)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete post"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <span className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-subtle)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-subtle)] transition-all duration-200">
            <ArrowUpRight size={16} />
          </span>
        )}
      </div>
    </div>
  </motion.article>
));

/* -------------------------------------------------------------------------- */
/*                                MAIN SCREEN                                 */
/* -------------------------------------------------------------------------- */

function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(staticBlogs || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, blogs]);

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const gridBlogs = filteredBlogs.length > 0 ? filteredBlogs.slice(1) : [];

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((blog) => blog.category));
    return ["All", ...Array.from(cats)];
  }, [blogs]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <SEO
        title="Blog | Future of Work, Task Execution & OnIT INDIA Insights"
        description="OnIT INDIA blog: insights on future of work, task-based economies, execution platforms, digital and hyperlocal coordination. Thought leadership from the OnIT INDIA team."
        keywords="OnIT INDIA blog, onitindia, future of work, task execution platform, task marketplace India, execution infrastructure, micro task platform, task coordination, gig economy India, remote work"
        canonical="https://www.onitindia.com/blog"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "OnIT INDIA Blog — The Journal",
          description: "Insights, updates, and thought leadership on task execution and the future of work from OnIT INDIA.",
          url: "https://www.onitindia.com/blog",
        }}
      />

      {/* App shell already clears fixed marquee + nav — avoid stacking large pt-* here */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 md:pt-7 pb-20 md:pb-28">

        {/* Page masthead */}
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                  <BookOpen size={20} strokeWidth={2} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                  The Journal
                </span>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px]">
                <SearchInput value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] leading-[1.15]">
                Insights on the future of work
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
                Thought leadership on task-based economies, execution platforms, and coordination infrastructure from the OnIT INDIA team.
              </p>
            </div>
          </div>
        </header>

        {/* Featured article */}
        {loading && page === 1 ? (
          <SkeletonHero />
        ) : (
          featuredBlog && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              aria-label="Featured article"
              className="mb-16 md:mb-20"
            >
              <button
                type="button"
                onClick={() => navigate(`/blog/${featuredBlog._id}`)}
                className="w-full text-left group block"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] p-6 md:p-10 lg:p-12 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border)] transition-all duration-300 overflow-hidden">
                  <div className="order-2 lg:order-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-white">
                        Featured
                      </span>
                      <span className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={12} /> {calculateReadingTime(featuredBlog.description)} min read
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)] leading-[1.2] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-sm md:text-lg text-[var(--color-text-muted)] leading-relaxed line-clamp-3 mb-6">
                      {featuredBlog.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredBlog.author}`}
                        alt={`Avatar of ${featuredBlog.author}`}
                        className="w-11 h-11 rounded-full border-2 border-[var(--color-surface-elevated)] bg-[var(--color-border-subtle)] object-cover"
                      />
                      <div className="text-sm">
                        <p className="font-bold text-[var(--color-text)]">{featuredBlog.author}</p>
                        <time dateTime={featuredBlog.date} className="text-[var(--color-text-muted)] font-medium">
                          {formatDate(featuredBlog.date)}
                        </time>
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, featuredBlog._id)}
                          className="ml-auto p-2.5 text-[var(--color-text-subtle)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete featured post"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="order-1 lg:order-2 relative aspect-[16/10] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-border-subtle)]">
                    <img
                      src={cloudImg(featuredBlog.image)}
                      alt={featuredBlog.title ? `Featured image for ${featuredBlog.title}` : "Featured blog post image"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </button>
            </motion.section>
          )
        )}

        {/* Articles section (by category or all) */}
        <section aria-label={activeCategory === "All" ? "All articles" : `${activeCategory} articles`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-[var(--color-text)] uppercase tracking-wider">
              {activeCategory === "All" ? "All articles" : activeCategory}
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
          </div>

          {activeCategory !== "All" && CATEGORY_META[activeCategory] && (
            <CategorySectionIntro category={activeCategory} />
          )}

          {gridBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {gridBlogs.map((post, index) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    index={index}
                    onClick={() => navigate(`/blog/${post._id}`)}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 md:py-24 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-border-subtle)] flex items-center justify-center mx-auto mb-4 text-[var(--color-text-subtle)]">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">No articles found</h3>
                <p className="text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                  Try a different search term or category.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )
          )}

          {!searchQuery && blogs.length > 0 && filteredBlogs.length > 6 && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-md)] active:scale-[0.98] transition-all duration-200"
              >
                Load more
                <ChevronRight size={18} className="group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </section>

      </div>

      <Footer />
    </div>
  );
}

export default BlogList;
