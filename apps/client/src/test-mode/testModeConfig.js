/**
 * Centralized Frontend Test Mode Configuration.
 * 
 * Safe local testing environment:
 * - Active ONLY when explicitly enabled or in local development (localhost / 127.0.0.1).
 * - HARD BLOCKED in production deployments on remote hosts.
 * - Manages mock authenticated role (PROVIDER, TASKER/PERFORMER, ADMIN, GUEST).
 * - Dispatches window events when role or test mode changes so UI updates reactively.
 */

const STORAGE_TEST_MODE_KEY = 'onit_frontend_test_mode';
const STORAGE_TEST_ROLE_KEY = 'onit_test_active_role';
const STORAGE_SIMULATE_EMPTY_KEY = 'onit_test_simulate_empty';
const STORAGE_SIMULATE_SLOW_KEY = 'onit_test_simulate_slow';

export const TEST_ROLES = {
  PROVIDER: 'PROVIDER',
  PERFORMER: 'TASKER', // in AuthContext & backend, performer is stored as 'TASKER'
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
};

/**
 * Determine if running in a safe local development environment.
 */
export function isLocalEnvironment() {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    import.meta.env.DEV
  );
}

/**
 * Check if Frontend Test Mode is currently active.
 * Defaults to true in local development unless explicitly disabled.
 */
export function isTestModeEnabled() {
  if (!isLocalEnvironment()) {
    return false; // Safety lock: NEVER enable in remote production bundles
  }

  const stored = localStorage.getItem(STORAGE_TEST_MODE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }

  // Check URL query param ?testMode=true or ?testMode=false
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('testMode')) {
      const paramVal = params.get('testMode') === 'true';
      localStorage.setItem(STORAGE_TEST_MODE_KEY, String(paramVal));
      return paramVal;
    }
  }

  // Default enabled for local testing clone
  return true;
}

/**
 * Toggle test mode state.
 */
export function setTestModeEnabled(enabled) {
  if (!isLocalEnvironment() && enabled) {
    console.warn('[TEST MODE] Cannot enable test mode in production environment.');
    return;
  }
  localStorage.setItem(STORAGE_TEST_MODE_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('onit-test-mode-change', { detail: { enabled } }));
}

/**
 * Get the currently active mock testing role.
 * Defaults to 'PROVIDER' for smooth entry into dashboard.
 */
export function getTestRole() {
  const role = localStorage.getItem(STORAGE_TEST_ROLE_KEY);
  if (role && Object.values(TEST_ROLES).includes(role)) {
    return role;
  }
  return TEST_ROLES.PROVIDER;
}

/**
 * Switch active testing role.
 */
export function setTestRole(role) {
  const normalized = role === 'PERFORMER' ? TEST_ROLES.PERFORMER : role;
  localStorage.setItem(STORAGE_TEST_ROLE_KEY, normalized);
  localStorage.setItem('userRole', normalized);

  // Sync with AuthContext user object if available
  try {
    const userStr = localStorage.getItem('onit_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.role = normalized;
      localStorage.setItem('onit_user', JSON.stringify(user));
    }
  } catch (e) {
    // Ignore parse error
  }

  window.dispatchEvent(new CustomEvent('onit-test-role-change', { detail: { role: normalized } }));
}

/**
 * Simulation toggles: Empty States & Network Latency.
 */
export function isSimulateEmptyEnabled() {
  return localStorage.getItem(STORAGE_SIMULATE_EMPTY_KEY) === 'true';
}

export function setSimulateEmptyEnabled(enabled) {
  localStorage.setItem(STORAGE_SIMULATE_EMPTY_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('onit-test-simulation-change', { detail: { simulateEmpty: enabled } }));
}

export function isSimulateSlowEnabled() {
  return localStorage.getItem(STORAGE_SIMULATE_SLOW_KEY) === 'true';
}

export function setSimulateSlowEnabled(enabled) {
  localStorage.setItem(STORAGE_SIMULATE_SLOW_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('onit-test-simulation-change', { detail: { simulateSlow: enabled } }));
}
