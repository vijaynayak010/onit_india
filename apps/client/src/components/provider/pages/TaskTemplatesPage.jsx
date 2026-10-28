import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProviderHeader from "../components/ProviderHeader";
import BrowseCategoryGrid from "../components/BrowseCategoryGrid";
import { Search, Mic, SlidersHorizontal, ArrowRight, X, Loader2 } from "lucide-react";
import { useHomeContent } from "../../../services/homeContent";

const normalize = (value = "") => String(value).trim().toLowerCase();

const mapCategoryTemplate = (template, category) => ({
  id: template.id || `${category.id || category.slug || category.title}-${template.title}`,
  title: template.title || "",
  description: template.description || "",
  category: category.title || category.slug || "General",
  budget: template.budget || (template.priceAmount ? `₹${Number(template.priceAmount).toLocaleString("en-IN")}` : ""),
  taskType: template.taskType || template.details?.taskType || "One-time",
  skills: Array.isArray(template.skills) ? template.skills : [],
  tag: template.tag || category.title || "",
  imageUrl: template.imageUrl || "",
  details: template.details || null,
});

const TaskTemplatesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, loading: categoriesLoading } = useHomeContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || null);

  const searchQuery = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  const categoryTemplates = useMemo(() => {
    return categories.flatMap((category) => {
      const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
      return templates
        .filter((template) => template?.isActive !== false && template?.title)
        .map((template) => mapCategoryTemplate(template, category));
    });
  }, [categories]);

  const filteredTemplates = useMemo(() => {
    const category = normalize(selectedCategory);
    return categoryTemplates.filter((template) => {
      const templateText = [
        template.title,
        template.description,
        template.category,
        template.tag,
        ...(template.skills || []),
      ].join(" ").toLowerCase();
      const categoryMatch =
        !category ||
        normalize(template.category).includes(category) ||
        category.includes(normalize(template.category)) ||
        templateText.includes(category);
      const searchMatch = !searchQuery || templateText.includes(searchQuery);
      return categoryMatch && searchMatch;
    });
  }, [categoryTemplates, searchQuery, selectedCategory]);

  const handleCategorySelect = (item) => {
    const category = item.category || item.label || item.slug || "";
    setSelectedCategory(category);
  };

  const handleTemplateSelect = (template) => {
    navigate("/provider/post-task-manual", {
      state: {
        templateData: template,
      },
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-surface)] pt-[80px] font-sans antialiased">
      <ProviderHeader activePage="home" />

      <div className="shrink-0 border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-subtle)]"
                strokeWidth={2.25}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search categories… e.g. "Web Design"'
                className="w-full rounded-full border border-[var(--color-primary)]/25 bg-white py-3.5 pl-12 pr-24 text-sm font-medium text-[var(--color-text)] shadow-[var(--shadow-xs)] placeholder:text-[var(--color-text-subtle)] transition focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                <button
                  type="button"
                  className="rounded-full p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
                >
                  <Mic className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                  className="rounded-full p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
                  title="Clear filters"
                >
                  <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[var(--color-surface)]">
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8"
        >
          <BrowseCategoryGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={handleCategorySelect}
            className="mb-6"
          />

          <section className="mt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[var(--color-text)]">
                  {selectedCategory ? `${selectedCategory} templates` : "Task templates"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
                  Choose a template to prefill your task details.
                </p>
              </div>
              {selectedCategory || searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchTerm("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              ) : null}
            </div>

            {categoriesLoading ? (
              <div className="flex h-40 items-center justify-center rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white text-[var(--color-primary)]">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-white py-14 text-center">
                <p className="text-base font-bold text-[var(--color-text)]">No templates found</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
                  {selectedCategory
                    ? "No admin templates are active for this category yet."
                    : "Add active category templates from the admin portal."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <article
                    key={template.id}
                    className="flex min-w-0 flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)]">
                        {template.category}
                      </span>
                      {template.budget ? (
                        <span className="text-xs font-black text-[var(--color-text)]">{template.budget}</span>
                      ) : null}
                    </div>
                    {template.imageUrl ? (
                      <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]">
                        <img src={template.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <h3 className="line-clamp-2 text-base font-black leading-snug text-[var(--color-text)]">{template.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">{template.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(template.skills || []).slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-md border border-[var(--color-border)] px-2 py-1 text-[11px] font-bold text-[var(--color-text-muted)]">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
                    >
                      Use template
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </motion.main>
      </div>
    </div>
  );
};

export default TaskTemplatesPage;
