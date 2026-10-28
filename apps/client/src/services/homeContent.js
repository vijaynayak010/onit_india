import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { getApiUrl } from "../config/apiBase";

const EMPTY_HOME_CONTENT = { slides: [], categories: [], updatedAt: null };

/** @typedef {{ id: string, title: string, subtitle?: string, imageUrl?: string, linkUrl?: string, sortOrder?: number, isActive?: boolean }} HomeSlide */
/** @typedef {{ id: string, title: string, slug?: string, description?: string, imageUrl?: string, iconName?: string, linkUrl?: string, sortOrder?: number, isActive?: boolean, commissionType?: string, commissionValue?: number, commissionIsActive?: boolean }} HomeCategory */

const ICON_PALETTE = [
  { iconColor: "#6366f1", iconBg: "#eef2ff" },
  { iconColor: "#a855f7", iconBg: "#f3e8ff" },
  { iconColor: "#3b82f6", iconBg: "#eff6ff" },
  { iconColor: "#ec4899", iconBg: "#fdf2f8" },
  { iconColor: "#22c55e", iconBg: "#f0fdf4" },
  { iconColor: "#f59e0b", iconBg: "#fffbeb" },
  { iconColor: "#14b8a6", iconBg: "#f0fdfa" },
  { iconColor: "#ef4444", iconBg: "#fef2f2" },
];

let cachedHomeContent = null;
let inflightHomeContent = null;

export function sortHomeItems(items = []) {
  return [...items].sort(
    (a, b) => (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0)
  );
}

function isActiveItem(item) {
  return item?.isActive !== false;
}

/**
 * Normalize public home-content payload (defensive filter + sort).
 * Public API already returns active-only items; we still guard client-side.
 */
export function normalizeHomeContent(data = {}) {
  const slides = sortHomeItems(
    (Array.isArray(data.slides) ? data.slides : []).filter(isActiveItem)
  );
  const categories = sortHomeItems(
    (Array.isArray(data.categories) ? data.categories : []).filter(isActiveItem)
  );
  return {
    slides,
    categories,
    updatedAt: data.updatedAt || null,
  };
}

export function resolveHomeIcon(iconName) {
  const key = String(iconName || "").trim();
  if (key && LucideIcons[key]) return LucideIcons[key];
  return LucideIcons.Sparkles;
}

export function getCategoryAccent(index = 0) {
  return ICON_PALETTE[Math.abs(Number(index) || 0) % ICON_PALETTE.length];
}

/**
 * Map API category → browse-grid / skill-chip item shape.
 */
export function mapHomeCategoryToBrowseItem(category, index = 0) {
  const accent = getCategoryAccent(index);
  return {
    id: category.id || category.slug || `category-${index}`,
    label: category.title || category.slug || "Category",
    category: category.title || category.slug || "General",
    slug: category.slug || category.id || "",
    description: category.description || "",
    imageUrl: category.imageUrl || "",
    linkUrl: category.linkUrl || "",
    icon: resolveHomeIcon(category.iconName),
    iconName: category.iconName || "Sparkles",
    iconColor: accent.iconColor,
    iconBg: accent.iconBg,
    iconBgClass: "bg-emerald-100",
    iconColorClass: "text-emerald-600",
    raw: category,
  };
}

/**
 * Public homepage content — GET /settings/home-content
 * @returns {Promise<{ slides: HomeSlide[], categories: HomeCategory[], updatedAt: string | null }>}
 */
export async function fetchHomeContent({ force = false } = {}) {
  if (!force && cachedHomeContent) return cachedHomeContent;
  if (!force && inflightHomeContent) return inflightHomeContent;

  inflightHomeContent = (async () => {
    try {
      const res = await fetch(getApiUrl("/settings/home-content"), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        cachedHomeContent = { ...EMPTY_HOME_CONTENT };
        return cachedHomeContent;
      }
      const data = await res.json();
      // Support both bare payload and `{ content: {...} }` wrappers.
      const payload = data?.content && (data.content.slides || data.content.categories)
        ? data.content
        : data;
      cachedHomeContent = normalizeHomeContent(payload);
      return cachedHomeContent;
    } catch {
      cachedHomeContent = { ...EMPTY_HOME_CONTENT };
      return cachedHomeContent;
    } finally {
      inflightHomeContent = null;
    }
  })();

  return inflightHomeContent;
}

/**
 * React hook for slides + categories from home:content.
 */
export function useHomeContent() {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHomeContent().then((data) => {
      if (cancelled) return;
      setSlides(data.slides || []);
      setCategories(data.categories || []);
      setUpdatedAt(data.updatedAt || null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { slides, categories, updatedAt, loading };
}
