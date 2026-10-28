import { savePerformer, unsavePerformer } from '../services/api';

export const SAVED_PERFORMERS_KEY = "onit_provider_saved_performers";

export const getSavedPerformerIds = () => {
  try {
    const raw = localStorage.getItem(SAVED_PERFORMERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const toggleSavedPerformer = (id) => {
  const ids = getSavedPerformerIds();
  const isSaved = ids.includes(id);
  const next = isSaved ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(SAVED_PERFORMERS_KEY, JSON.stringify(next));
  // Fire-and-forget API call — localStorage is still the UI source of truth
  if (isSaved) {
    unsavePerformer(id).catch((err) => console.warn('[SavedPerformers] unsave API failed:', err));
  } else {
    savePerformer(id).catch((err) => console.warn('[SavedPerformers] save API failed:', err));
  }
  return next;
};
