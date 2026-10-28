import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isTestModeEnabled,
  setTestModeEnabled,
  getTestRole,
  setTestRole,
  TEST_ROLES,
  isSimulateEmptyEnabled,
  setSimulateEmptyEnabled,
  isSimulateSlowEnabled,
  setSimulateSlowEnabled,
} from '../testModeConfig';
import { mockDb } from '../mockDatabase';
import {
  ShieldCheck,
  RotateCcw,
  Compass,
  Sliders,
  ChevronDown,
  ChevronUp,
  UserCheck,
  AlertCircle,
  Eye,
  Activity,
} from 'lucide-react';

export default function TestModeBadge() {
  const [enabled, setEnabled] = useState(isTestModeEnabled);
  const [activeRole, setActiveRole] = useState(getTestRole);
  const [simulateEmpty, setSimulateEmpty] = useState(isSimulateEmptyEnabled);
  const [simulateSlow, setSimulateSlow] = useState(isSimulateSlowEnabled);
  const [isExpanded, setIsExpanded] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoleChange = (e) => setActiveRole(e.detail?.role || getTestRole());
    const handleModeChange = (e) => setEnabled(e.detail?.enabled ?? isTestModeEnabled());
    const handleSimChange = (e) => {
      if (e.detail?.simulateEmpty !== undefined) setSimulateEmpty(e.detail.simulateEmpty);
      if (e.detail?.simulateSlow !== undefined) setSimulateSlow(e.detail.simulateSlow);
    };

    window.addEventListener('onit-test-role-change', handleRoleChange);
    window.addEventListener('onit-test-mode-change', handleModeChange);
    window.addEventListener('onit-test-simulation-change', handleSimChange);

    return () => {
      window.removeEventListener('onit-test-role-change', handleRoleChange);
      window.removeEventListener('onit-test-mode-change', handleModeChange);
      window.removeEventListener('onit-test-simulation-change', handleSimChange);
    };
  }, []);

  const handleRoleSelect = (role) => {
    setTestRole(role);
    setActiveRole(role);
  };

  const handleResetSession = () => {
    mockDb.reset();
    setResetMessage('Session & data reset to clean initial state!');
    setTimeout(() => setResetMessage(''), 3000);
  };

  const toggleTestMode = () => {
    const next = !enabled;
    setEnabled(next);
    setTestModeEnabled(next);
  };

  return (
    <aside
      aria-label="Frontend Test Mode Control Panel"
      className="fixed bottom-4 right-4 z-[999999] font-sans transition-all duration-300"
    >
      {/* Collapsed Pill Badge */}
      {!isExpanded ? (
        <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-zinc-900/95 p-1.5 pl-3.5 shadow-2xl backdrop-blur-md text-white">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${enabled ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-[11px] font-black tracking-wider uppercase">
              {enabled ? 'Frontend Test Mode' : 'Test Mode (OFF)'}
            </span>
          </div>

          {enabled && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border border-zinc-700">
              {activeRole}
            </span>
          )}

          <button
            onClick={() => setIsExpanded(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Expand Test Controls"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Expanded Floating Test Panel */
        <div className="w-80 sm:w-96 rounded-2xl border border-zinc-700 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl text-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-xs font-black tracking-wider uppercase text-zinc-100">
                Frontend Test Mode
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-zinc-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={toggleTestMode}
                  className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                />
                Active
              </label>
              <button
                onClick={() => setIsExpanded(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-emerald-400" />
                Active Mock Role
              </span>
              <span className="text-[10px] text-zinc-500">Instant Switch</span>
            </div>
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800">
              {[
                { role: TEST_ROLES.PROVIDER, label: 'Provider' },
                { role: TEST_ROLES.PERFORMER, label: 'Performer' },
                { role: TEST_ROLES.ADMIN, label: 'Admin' },
                { role: TEST_ROLES.GUEST, label: 'Guest' },
              ].map(({ role, label }) => {
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`rounded-lg py-1.5 text-[11px] font-extrabold transition-all text-center ${
                      isActive
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator Flags */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const next = !simulateEmpty;
                setSimulateEmpty(next);
                setSimulateEmptyEnabled(next);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-[10px] font-bold transition ${
                simulateEmpty
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              {simulateEmpty ? 'Empty State: ON' : 'Simulate Empty'}
            </button>

            <button
              onClick={() => {
                const next = !simulateSlow;
                setSimulateSlow(next);
                setSimulateSlowEnabled(next);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-[10px] font-bold transition ${
                simulateSlow
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              {simulateSlow ? 'Slow Net: ON (1.2s)' : 'Simulate Latency'}
            </button>
          </div>

          {/* Actions: Page Explorer & Reset */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => navigate('/test-explorer')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 text-xs font-bold transition shadow-lg shadow-emerald-950/40"
            >
              <Compass className="h-3.5 w-3.5" />
              Manual Page Explorer
            </button>

            <button
              onClick={handleResetSession}
              className="flex items-center justify-center gap-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2.5 text-xs font-bold transition"
              title="Reset Mock Database"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Reset toast */}
          {resetMessage && (
            <div className="mt-2 text-center text-[10px] font-bold text-emerald-400 animate-fade-in">
              {resetMessage}
            </div>
          )}

          {/* Footer notice */}
          <div className="mt-3 border-t border-zinc-800/80 pt-2 text-[9px] text-zinc-500 flex items-center justify-between">
            <span>Manual Testing Clone</span>
            <span className="font-mono text-zinc-400">185+ Routes Ready</span>
          </div>
        </div>
      )}
    </aside>
  );
}
