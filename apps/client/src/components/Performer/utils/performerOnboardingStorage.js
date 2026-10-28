const STORAGE_PREFIX = "performer_onboarding_complete_v1";

export function getOnboardingStorageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

export function isPerformerOnboardingComplete(userId) {
  try {
    return localStorage.getItem(getOnboardingStorageKey(userId)) === "true";
  } catch {
    return false;
  }
}

export function markPerformerOnboardingComplete(userId) {
  try {
    localStorage.setItem(getOnboardingStorageKey(userId), "true");
  } catch {
    /* ignore */
  }
}

export function clearPerformerOnboardingComplete(userId) {
  try {
    localStorage.removeItem(getOnboardingStorageKey(userId));
  } catch {
    /* ignore */
  }
}
