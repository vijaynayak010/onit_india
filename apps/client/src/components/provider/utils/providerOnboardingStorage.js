const STORAGE_PREFIX = "provider_onboarding_complete_v1";

export function getProviderOnboardingStorageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

export function isProviderOnboardingComplete(userId) {
  try {
    return localStorage.getItem(getProviderOnboardingStorageKey(userId)) === "true";
  } catch {
    return false;
  }
}

export function markProviderOnboardingComplete(userId) {
  try {
    localStorage.setItem(getProviderOnboardingStorageKey(userId), "true");
  } catch {
    /* ignore */
  }
}

export function clearProviderOnboardingComplete(userId) {
  try {
    localStorage.removeItem(getProviderOnboardingStorageKey(userId));
  } catch {
    /* ignore */
  }
}
