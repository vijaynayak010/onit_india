import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger quiet background data reloads.
 * 
 * Triggers reloads when:
 * 1. The window/tab is focused by the user.
 * 2. The document visibility state transitions back to 'visible'.
 * 3. A custom 'onit-update' socket-push event is dispatched.
 * 4. A periodic background interval expires (paused when the tab is inactive).
 * 
 * @param {Function} fetchCallback - The function to call silently (e.g. `fetchData(false)`).
 * @param {number} intervalMs - The polling frequency in milliseconds (default: 12000).
 */
export function useAutoReload(fetchCallback, intervalMs = 12000) {
  const fetchRef = useRef(fetchCallback);

  // Keep callback reference updated to avoid stale closures
  useEffect(() => {
    fetchRef.current = fetchCallback;
  }, [fetchCallback]);

  useEffect(() => {
    // Fire dynamic background fetch silently
    const triggerFetch = () => {
      if (typeof fetchRef.current === 'function') {
        fetchRef.current(false);
      }
    };

    // 1. Refresh when window is focused or visibility changes to visible
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        triggerFetch();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // 2. Refresh on custom socket push notifications
    const handleCustomUpdate = () => {
      triggerFetch();
    };
    window.addEventListener('onit-update', handleCustomUpdate);

    // 3. Periodic quiet background sync (only active when tab is visible)
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        triggerFetch();
      }
    }, intervalMs);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('onit-update', handleCustomUpdate);
      clearInterval(intervalId);
    };
  }, [intervalMs]);
}
