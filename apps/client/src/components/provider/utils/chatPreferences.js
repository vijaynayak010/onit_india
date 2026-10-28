const storageKey = (userId) => `onit_chat_prefs_${userId || "guest"}`;

const emptyPrefs = () => ({
  pinned: [],
  archived: [],
  starred: [],
  muted: [],
});

export function loadChatPrefs(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return emptyPrefs();
    const parsed = JSON.parse(raw);
    return {
      pinned: Array.isArray(parsed.pinned) ? parsed.pinned.map(String) : [],
      archived: Array.isArray(parsed.archived) ? parsed.archived.map(String) : [],
      starred: Array.isArray(parsed.starred) ? parsed.starred.map(String) : [],
      muted: Array.isArray(parsed.muted) ? parsed.muted.map(String) : [],
    };
  } catch {
    return emptyPrefs();
  }
}

export function saveChatPrefs(userId, prefs) {
  localStorage.setItem(storageKey(userId), JSON.stringify(prefs));
}

export function applyChatPrefsToList(conversations, userId) {
  const prefs = loadChatPrefs(userId);
  return conversations.map((c) => {
    const id = String(c._id);
    return {
      ...c,
      isPinned: prefs.pinned.includes(id),
      isArchived: prefs.archived.includes(id),
      isStarred: prefs.starred.includes(id),
      isMuted: prefs.muted.includes(id),
    };
  });
}

export function updateChatPrefs(userId, updater) {
  const current = loadChatPrefs(userId);
  const next = updater(current);
  saveChatPrefs(userId, next);
  return next;
}

export function setPinned(userId, chatIds, pinned) {
  const ids = chatIds.map(String);
  return updateChatPrefs(userId, (prefs) => {
    const set = new Set(prefs.pinned);
    ids.forEach((id) => (pinned ? set.add(id) : set.delete(id)));
    return { ...prefs, pinned: Array.from(set) };
  });
}

export function setArchived(userId, chatIds, archived) {
  const ids = chatIds.map(String);
  return updateChatPrefs(userId, (prefs) => {
    const set = new Set(prefs.archived);
    ids.forEach((id) => (archived ? set.add(id) : set.delete(id)));
    return { ...prefs, archived: Array.from(set) };
  });
}

export function setStarred(userId, chatIds, starred) {
  const ids = chatIds.map(String);
  return updateChatPrefs(userId, (prefs) => {
    const set = new Set(prefs.starred);
    ids.forEach((id) => (starred ? set.add(id) : set.delete(id)));
    return { ...prefs, starred: Array.from(set) };
  });
}

export function removeFromPrefs(userId, chatIds) {
  const ids = new Set(chatIds.map(String));
  return updateChatPrefs(userId, (prefs) => ({
    pinned: prefs.pinned.filter((id) => !ids.has(id)),
    archived: prefs.archived.filter((id) => !ids.has(id)),
    starred: prefs.starred.filter((id) => !ids.has(id)),
    muted: prefs.muted.filter((id) => !ids.has(id)),
  }));
}
