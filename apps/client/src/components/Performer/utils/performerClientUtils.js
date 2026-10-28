/**
 * Resolve provider profile UUID from a task payload.
 * Backend shapes vary: nested provider.provider.id, or top-level providerId.
 */
export function resolveProviderProfileId(task) {
  if (!task) return null;
  return (
    task.provider?.provider?.id ||
    task.providerProfileId ||
    task.providerId ||
    null
  );
}

/**
 * Resolve a human-readable client name from task embed + optional profile fetch.
 */
export function resolveClientDisplayName(task, providerProfile) {
  const providerUser = task?.provider;
  const nestedProfile = providerUser?.provider;

  const candidates = [
    providerProfile?.organization,
    providerProfile?.username,
    providerProfile?.businessName,
    providerProfile?.user?.displayName,
    providerProfile?.user?.name,
    providerProfile?.user?.username,
    nestedProfile?.organization,
    nestedProfile?.username,
    nestedProfile?.businessName,
    providerUser?.organization,
    providerUser?.username,
    providerUser?.businessName,
    providerUser?.displayName,
    providerUser?.name,
    providerUser?.user?.displayName,
    providerUser?.user?.name,
    providerProfile?.user?.email?.split('@')[0],
    providerUser?.email?.split('@')[0],
  ];

  for (const value of candidates) {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (trimmed) return trimmed;
  }

  return 'Client';
}

export function resolveClientUserId(task, providerProfile) {
  return (
    providerProfile?.user?.id ||
    task?.providerUserId ||
    task?.provider?.id ||
    task?.provider?.user?.id ||
    null
  );
}
