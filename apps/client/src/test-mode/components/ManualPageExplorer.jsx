import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CATALOG } from '../routeCatalog';
import { setTestRole, TEST_ROLES, isTestModeEnabled } from '../testModeConfig';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const STORAGE_PROGRESS_KEY = 'onit_manual_test_progress_v1';

export default function ManualPageExplorer() {
  const navigate = useNavigate();

  // Test progress: { [routeId]: { status: 'NOT TESTED' | 'PASS' | 'FAIL' | 'BLOCKED', notes: '' } }
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse test progress', e);
    }
    return {};
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save test progress', e);
    }
  }, [progress]);

  const updateStatus = (routeId, status) => {
    setProgress((prev) => ({
      ...prev,
      [routeId]: {
        ...(prev[routeId] || {}),
        status,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const updateNotes = (routeId, notes) => {
    setProgress((prev) => ({
      ...prev,
      [routeId]: {
        ...(prev[routeId] || {}),
        notes,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset all manual testing progress and notes?')) {
      setProgress({});
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
    }
  };

  const exportReport = () => {
    const reportData = ROUTE_CATALOG.map((r) => {
      const item = progress[r.id] || { status: 'NOT TESTED', notes: '' };
      return {
        id: r.id,
        name: r.name,
        path: r.path,
        sampleUrl: r.sampleUrl,
        module: r.module,
        role: r.role,
        backendDependency: r.backend,
        manualStatus: item.status || 'NOT TESTED',
        notes: item.notes || '',
        updatedAt: item.updatedAt || 'Never',
      };
    });

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onit-manual-testing-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenPage = (route) => {
    // Auto-adjust active test role to match the target page requirement
    if (route.role === 'Provider') {
      setTestRole(TEST_ROLES.PROVIDER);
    } else if (route.role === 'Performer') {
      setTestRole(TEST_ROLES.PERFORMER);
    } else if (route.role === 'Admin') {
      setTestRole(TEST_ROLES.ADMIN);
    }

    // Navigate to page
    navigate(route.sampleUrl);
  };

  // Filtered route list
  const filteredRoutes = useMemo(() => {
    return ROUTE_CATALOG.filter((route) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        route.name.toLowerCase().includes(q) ||
        route.path.toLowerCase().includes(q) ||
        route.sampleUrl.toLowerCase().includes(q) ||
        route.module.toLowerCase().includes(q);

      const matchesModule = selectedModule === 'ALL' || route.module === selectedModule;
      const matchesRole = selectedRole === 'ALL' || route.role === selectedRole;

      const itemStatus = progress[route.id]?.status || 'NOT TESTED';
      const matchesStatus = selectedStatus === 'ALL' || itemStatus === selectedStatus;

      return matchesSearch && matchesModule && matchesRole && matchesStatus;
    });
  }, [searchQuery, selectedModule, selectedRole, selectedStatus, progress]);

  // Metric stats
  const stats = useMemo(() => {
    const total = ROUTE_CATALOG.length;
    let pass = 0;
    let fail = 0;
    let blocked = 0;

    ROUTE_CATALOG.forEach((r) => {
      const status = progress[r.id]?.status;
      if (status === 'PASS') pass += 1;
      else if (status === 'FAIL') fail += 1;
      else if (status === 'BLOCKED') blocked += 1;
    });

    const tested = pass + fail + blocked;
    const percentage = Math.round((tested / total) * 100);

    return { total, tested, pass, fail, blocked, percentage };
  }, [progress]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 selection:bg-emerald-500 selection:text-black">
      {/* Top Banner */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Return to Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-base font-black tracking-wider uppercase text-white">
                  Manual Page Explorer
                </h1>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                  TEST CLONE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                100% human manual inspection dashboard. Review layout, buttons, forms, and states.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Export JSON
            </button>
            <button
              onClick={resetAllProgress}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* Progress & Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
            <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Total Routes</span>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Discovered paths</div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
            <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400">Passed</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats.pass}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Verified clean</div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-400">Failed</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{stats.fail}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Issues logged</div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
            <span className="text-[10px] font-black tracking-wider uppercase text-amber-400">Blocked</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{stats.blocked}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Prerequisites</div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-cyan-400">Coverage</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{stats.percentage}%</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{stats.tested} / {stats.total} tested</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-900 rounded-full h-2 mb-6 overflow-hidden border border-zinc-800">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by page name, route path, or keyword (e.g. 'wallet', 'active-task', 'pricing')..."
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/60">
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 mr-2">
              <SlidersHorizontal className="h-3 w-3 text-emerald-400" />
              Module:
            </div>
            {['ALL', 'Public', 'Auth', 'Provider', 'Performer', 'Admin'].map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedModule === mod
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {mod}
              </button>
            ))}

            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 ml-3 mr-2">
              Role:
            </div>
            {['ALL', 'Public', 'Provider', 'Performer', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedRole === role
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {role}
              </button>
            ))}

            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 ml-3 mr-2">
              Status:
            </div>
            {['ALL', 'NOT TESTED', 'PASS', 'FAIL', 'BLOCKED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedStatus === st
                    ? 'bg-cyan-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Route Cards Grid */}
        <div className="flex flex-col gap-3">
          {filteredRoutes.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
              No matching pages found for current search/filter combination.
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const itemProgress = progress[route.id] || { status: 'NOT TESTED', notes: '' };
              const currentStatus = itemProgress.status || 'NOT TESTED';

              const statusBadgeStyles = {
                'NOT TESTED': 'bg-zinc-800 text-zinc-400 border-zinc-700',
                PASS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                FAIL: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                BLOCKED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              }[currentStatus];

              return (
                <div
                  key={route.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 p-4 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Route Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white">{route.name}</span>
                        <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300 border border-zinc-700">
                          {route.module}
                        </span>
                        <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-zinc-700">
                          {route.role}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span>Path:</span>
                        <span className="text-zinc-200 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {route.sampleUrl}
                        </span>
                      </div>

                      <div className="mt-1.5 text-[11px] text-zinc-500 flex items-center gap-1.5">
                        <span className="font-bold text-zinc-400">Backend Dependency:</span>
                        <span>{route.backend}</span>
                      </div>
                    </div>

                    {/* Action & Status Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      {/* Status Dropdown */}
                      <select
                        value={currentStatus}
                        onChange={(e) => updateStatus(route.id, e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none cursor-pointer transition ${statusBadgeStyles}`}
                      >
                        <option value="NOT TESTED">NOT TESTED</option>
                        <option value="PASS">PASS ✓</option>
                        <option value="FAIL">FAIL ✗</option>
                        <option value="BLOCKED">BLOCKED ⚠️</option>
                      </select>

                      {/* Direct Navigation Button */}
                      <button
                        onClick={() => handleOpenPage(route)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-md shadow-emerald-950/40"
                      >
                        Open Page
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Manual Notes Area */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/60">
                    <input
                      type="text"
                      value={itemProgress.notes || ''}
                      onChange={(e) => updateNotes(route.id, e.target.value)}
                      placeholder="Enter testing notes, observed layout bugs, validation errors, or UI defects..."
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
