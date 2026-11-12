import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Cpu,
  Zap,
  Clock,
  User,
  Lock,
  Calendar,
  Video,
  ExternalLink,
  ChevronRight,
  Loader,
  X
} from 'react-feather';

/**
 * AIPoweredTaskFlow Component
 * Replaces the chatbot with a structured, premium multi-step wizard.
 * Includes Login Wall and Database Matching.
 */

const SPECIALISTS = [
  {
    id: 1,
    name: "Ankit Kumar",
    role: "Full Stack Developer",
    expertise: ["React", "Node.js", "MongoDB", "Mobile Development"],
    avatar: "AK",
    rating: 4.9,
    completedTasks: 127,
    hourlyRate: "₹800-₹1500/hr",
    bio: "Expert in building scalable web and mobile applications.",
    experience: "6+ years",
    availability: "Available this week",
    delivery: "Estimated start in 2 days"
  },
  {
    id: 2,
    name: "Sriram",
    role: "Backend Specialist",
    expertise: ["Node.js", "Python", "API Design", "Database Arch"],
    avatar: "SR",
    rating: 4.8,
    completedTasks: 98,
    hourlyRate: "₹700-₹1200/hr",
    bio: "Focused on high-performance backend systems.",
    experience: "5+ years",
    availability: "Available in 3 days",
    delivery: "Estimated start in 3-4 days"
  },
  {
    id: 3,
    name: "Love Magoo",
    role: "Flutter Developer",
    expertise: ["Flutter", "Dart", "iOS", "Android"],
    avatar: "LM",
    rating: 4.9,
    completedTasks: 85,
    hourlyRate: "₹900-₹1400/hr",
    bio: "Specialized in cross-platform mobile apps.",
    experience: "4+ years",
    availability: "Available this week",
    delivery: "Estimated start in 2-3 days"
  }
];

const BUDGET_RANGES = [
  "₹5,000 - ₹15,000",
  "₹15,000 - ₹50,000",
  "₹50,000 - ₹1,50,000",
  "₹1,50,000+"
];
const TIMELINES = ["< 1 Week", "2-4 Weeks", "1-3 Months", "Flexible"];

export default function AIPoweredTaskFlow({ onComplete, mode = 'landing', initialIsLoggedIn = false }) {
  const [step, setStep] = useState(1);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isMatching, setIsMatching] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const [formData, setFormData] = useState({
    idea: '',
    refinedIdea: '',
    details: '',
    budget: '',
    timeline: '',
    workType: 'Remote', // Default
    loginEmail: '',
    loginPassword: ''
  });

  const [customBudget, setCustomBudget] = useState('');
  const [customTimeline, setCustomTimeline] = useState('');
  const [showOtherBudget, setShowOtherBudget] = useState(false);
  const [showOtherTimeline, setShowOtherTimeline] = useState(false);

  const containerRef = useRef(null);

  const scrollToFlowTop = (behavior = 'smooth') => {
    const element = containerRef.current;
    if (!element) return;

    const yOffset = -132; // Align card's top color strip just below fixed headers
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: Math.max(0, y), behavior });
  };

  // Always align the flow to the top when component opens
  useEffect(() => {
    const timer = setTimeout(() => scrollToFlowTop('auto'), 0);
    return () => clearTimeout(timer);
  }, []);

  // Keep every step transition aligned to the top of the flow
  useEffect(() => {
    // Run multiple passes to handle animated content/layout shifts between steps.
    scrollToFlowTop(step === 1 ? 'auto' : 'smooth');
    const rafId = window.requestAnimationFrame(() => scrollToFlowTop('auto'));
    const settleTimer = window.setTimeout(() => scrollToFlowTop('auto'), 180);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
    };
  }, [step]);

  const handleNext = () => setStep(prev => prev + 1);

  const handleBackClick = () => {
    if (step > 1 && step < 6) {
      setShowBackConfirm(true);
    } else if (step === 6) {
      // Allow easy return from final step without confirm
      setStep(1);
    }
  };

  const confirmBack = () => {
    setStep(prev => prev - 1);
    setShowBackConfirm(false);
  };

  // AI Enhances the initial prompt
  const enhanceTaskWithAI = async () => {
    if (!formData.idea.trim()) return;
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Refine this project idea for a marketplace: ${formData.idea}` })
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, refinedIdea: data.data.description }));
        handleNext();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setStep(6); 
  };

  const handleFinalConfirm = () => {
    if (mode === 'landing' && !isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // In provider mode or if logged in, skip to final step
      setStep(6);
      if (onComplete) {
        onComplete({
          ...formData,
          specialist: selectedSpec
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto scroll-mt-24">

      <div className="bg-white rounded-3xl border-2 border-[var(--color-border)] shadow-[var(--shadow-xl)] overflow-hidden">
        {/* Card Header (Matches Post a Task UI) */}
        <div className="relative h-1.5 overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-500">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: INITIAL IDEA */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)]">
                    <Zap size={24} />
                  </div>
                  <h2 className="text-3xl font-medium text-[var(--color-text)]">What's your vision?</h2>
                </div>
              </div>
              <p className="text-[var(--color-text-muted)] mb-8 text-lg">Tell us about the product you want to build. Our AI will help clarify the requirements.</p>

              <div className="mb-5 rounded-xl border border-gray-100 bg-[var(--color-surface)] px-4 py-3 flex items-start gap-3">
                <Cpu size={16} className="text-[var(--color-primary)] mt-0.5" />
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Include target users, key workflows, and the problem this product should solve.
                </p>
              </div>

              <div className="relative group">
                <textarea
                  value={formData.idea}
                  onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                  placeholder="e.g., I want an Android app for my restaurant with online ordering..."
                  className="w-full min-h-[160px] p-6 text-lg rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none transition-all resize-none shadow-sm"
                />
                <div className="absolute bottom-4 right-4 text-xs font-bold text-gray-400 uppercase">{formData.idea.length} / 500</div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={enhanceTaskWithAI}
                  disabled={formData.idea.length < 10 || isEnhancing}
                  className="group px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {isEnhancing ? <Loader className="animate-spin" /> : <Cpu size={20} />}
                  {isEnhancing ? 'AI is thinking...' : 'Generate Smart Requirements'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AI REFINEMENT PREVIEW */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium flex items-center gap-2 text-[var(--color-primary)]">
                  <Zap size={24} />
                  AI Draft Recommendation
                </h3>
              </div>
              <div className="p-6 bg-[#EFFBFB] rounded-2xl border border-[#29ADAC]/20 mb-8 italic text-emerald-900 leading-relaxed">
                "{formData.refinedIdea}"
              </div>
              <p className="text-[var(--color-text-muted)] mb-8">We've enhanced your prompt based on platform standards. You can edit this in the next step.</p>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button onClick={handleBackClick} className="text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase text-sm tracking-widest flex items-center gap-2">
                  <ArrowLeft size={16} /> Edit Original
                </button>
                <button
                  onClick={() => {
                    if (onComplete) {
                      onComplete({
                        ...formData,
                        details: formData.refinedIdea || formData.idea
                      });
                    } else {
                      handleNext();
                    }
                  }}
                  className="px-10 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all"
                >
                  Looks Good, Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: MANUAL USER INPUTS (DETAIL + BUDGET + TIMELINE) */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-10 space-y-10">
              <div className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    AI Scope Builder
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-medium text-[var(--color-text)] mb-3">
                  Refine Your Project Scope
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed mb-6">
                  Share the core features, budget range, and target timeline so we can match you with the right specialist faster.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Core Features</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">Must-have functionality</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Budget</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">Planned investment range</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Timeline</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">Delivery expectations</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Details</label>
                  <textarea
                    defaultValue={formData.refinedIdea || formData.idea}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full p-4 border-2 border-[var(--color-border)] rounded-xl min-h-[120px] outline-none focus:border-[var(--color-primary)]"
                    placeholder="List core modules, integrations, user roles, and important quality expectations..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* WORK TYPE */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                       <User size={14} /> Preference
                    </label>
                    <div className="flex gap-4">
                       {['Remote', 'Onsite'].map(type => (
                          <button 
                            key={type} 
                            onClick={() => setFormData({...formData, workType: type})}
                            className={`flex-1 py-3.5 rounded-full border font-semibold text-sm transition-all ${formData.workType === type ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                          >
                             {type} Work
                          </button>
                       ))}
                    </div>
                  </div>

                  {/* BUDGET */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      ₹ Budget Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                       {BUDGET_RANGES.map(b => (
                         <button key={b} onClick={() => { setFormData({...formData, budget: b}); setShowOtherBudget(false); }} className={`px-4 py-3 rounded-full border text-[11px] font-semibold transition-all ${formData.budget === b && !showOtherBudget ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>
                           {b}
                         </button>
                       ))}
                       <button 
                         onClick={() => setShowOtherBudget(true)} 
                        className={`px-4 py-3 rounded-full border text-[11px] font-semibold transition-all ${showOtherBudget ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                       >
                         Other
                       </button>
                    </div>
                    {showOtherBudget && (
                      <input 
                        type="text" 
                        placeholder="Enter manual budget..."
                        value={customBudget}
                        onChange={(e) => {
                          setCustomBudget(e.target.value);
                          setFormData({...formData, budget: e.target.value});
                        }}
                        className="w-full p-3 border-2 border-gray-100 rounded-xl mt-2 outline-none focus:border-[var(--color-primary)] text-sm"
                      />
                    )}
                  </div>

                  {/* TIMELINE */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                       <Clock size={14} /> Timeline
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                       {TIMELINES.map(t => (
                         <button key={t} onClick={() => { setFormData({...formData, timeline: t}); setShowOtherTimeline(false); }} className={`px-4 py-3 rounded-full border text-[11px] font-semibold transition-all ${formData.timeline === t && !showOtherTimeline ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>
                           {t}
                         </button>
                       ))}
                       <button 
                         onClick={() => setShowOtherTimeline(true)} 
                        className={`px-4 py-3 rounded-full border text-[11px] font-semibold transition-all ${showOtherTimeline ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                       >
                         Other
                       </button>
                    </div>
                    {showOtherTimeline && (
                       <input 
                         type="text" 
                         placeholder="Enter manual timeline..."
                         value={customTimeline}
                         onChange={(e) => {
                           setCustomTimeline(e.target.value);
                           setFormData({...formData, timeline: e.target.value});
                         }}
                         className="w-full p-3 border-2 border-gray-100 rounded-xl mt-2 outline-none focus:border-[var(--color-primary)] text-sm"
                       />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-10 border-t border-gray-100">
                <button onClick={handleBackClick} className="text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase text-sm tracking-widest">Back</button>
                <button
                  disabled={!formData.budget || !formData.timeline}
                  onClick={() => {
                    setIsMatching(true);
                    setStep(4);
                    setTimeout(() => setIsMatching(false), 2000);
                  }}
                  className="px-10 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all shadow-[var(--shadow-glow)] disabled:opacity-50"
                >
                  View Perfect Matches
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DATABASE MATCHING PREVIEW */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 sm:p-12">
              {isMatching ? (
                <div className="py-20 text-center space-y-6">
                  <Loader className="animate-spin mx-auto text-[var(--color-primary)]" size={48} />
                  <h2 className="text-2xl font-medium animate-pulse">Syncing with our specialist database...</h2>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-medium mb-1">Top 3 Matches found!</h2>
                      <p className="text-[var(--color-text-muted)] italic">Based on your requirement for {formData.idea.substring(0, 30)}...</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    {SPECIALISTS.map(spec => (
                      <div
                        key={spec.id}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-lg)] transition-all cursor-pointer"
                        onClick={() => openMatchProfile(spec)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[#083B3A] flex items-center justify-center text-xl font-medium text-white shadow-md">
                            {spec.avatar}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <h4 className="text-xl font-medium text-[var(--color-text)]">{spec.name}</h4>
                                <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{spec.role}</p>
                                <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{spec.bio}</p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#EFFBFB] border border-[#29ADAC]/20 px-3 py-1.5">
                                  <Clock size={13} className="text-[#10605F]" />
                                  <span className="text-xs font-semibold text-[#10605F]">{spec.availability}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                              <div className="rounded-xl border border-gray-100 bg-[var(--color-surface)] px-3 py-2.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                                <p className="text-sm font-semibold text-[var(--color-text)]">{spec.experience}</p>
                              </div>
                              <div className="rounded-xl border border-gray-100 bg-[var(--color-surface)] px-3 py-2.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks Completed</p>
                                <p className="text-sm font-semibold text-[var(--color-text)]">{spec.completedTasks}</p>
                              </div>
                              <div className="rounded-xl border border-gray-100 bg-[var(--color-surface)] px-3 py-2.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rate</p>
                                <p className="text-sm font-semibold text-[#10605F]">{spec.hourlyRate}</p>
                              </div>
                              <div className="rounded-xl border border-gray-100 bg-[var(--color-surface)] px-3 py-2.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</p>
                                <p className="text-sm font-semibold text-amber-600">★ {spec.rating}</p>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {spec.expertise.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <p className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                                <Calendar size={13} className="text-[var(--color-primary)]" />
                                {spec.delivery}
                              </p>
                              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-hover)] transition-colors">
                                View Profile
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Select a profile to arrange a direct meeting</p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: REVIEW STEP */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 sm:p-12">
               <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-3xl border-2 border-[var(--color-border)]">
                  <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                     <CheckCircle className="text-[var(--color-primary)]" /> Review Your Project
                  </h3>
                  
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-50 shadow-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Performer Selection</p>
                           <p className="font-bold flex items-center gap-2 text-[var(--color-primary)]">
                              <User size={14}/> {selectedSpec?.name}
                           </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-50 shadow-sm">
                           <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Work Type</p>
                           <p className="font-bold">{formData.workType}</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-50 shadow-sm">
                           <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Budget</p>
                           <p className="font-bold text-[#10605F]">{formData.budget}</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border-2 border-gray-50 shadow-sm">
                           <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Timeline</p>
                           <p className="font-bold">{formData.timeline}</p>
                        </div>
                     </div>

                     <div className="p-4 bg-white rounded-xl border-2 border-gray-50 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Detailed Scope</p>
                        <p className="text-sm text-gray-600 italic">"{formData.details || formData.refinedIdea || formData.idea}"</p>
                     </div>
                  </div>
               </div>

               <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <button onClick={handleBackClick} className="text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase text-sm tracking-widest">Back</button>
                  <button 
                    onClick={handleFinalConfirm}
                    className="px-12 py-5 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all shadow-[var(--shadow-glow)] flex items-center gap-3"
                  >
                    Confirm & Book Meeting
                    <ArrowRight size={20} />
                  </button>
               </div>
            </motion.div>
          )}

          {/* STEP 6: FINAL CLOSURE (MEETING LINK) */}
          {step === 6 && (
            <motion.div key="s6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 sm:p-12 text-center space-y-10">
              <div className="w-24 h-24 mx-auto bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-[var(--shadow-glow)]">
                <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-medium mb-4">
                  {mode === 'provider' ? 'Task Posted Successfully!' : 'Meeting Confirmed!'}
                </h2>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  {mode === 'provider' 
                    ? `We've matched your task with specialists like ${selectedSpec?.name}. They've been notified and will reach out to you within minutes.`
                    : `We've shared your request with ${selectedSpec?.name}. Your discovery session is ready.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-[var(--color-surface)] rounded-2xl border-2 border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[var(--color-primary)] shadow-sm"><Calendar size={20} /></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">When</p>
                    <p className="text-sm font-bold">Tomorrow, 11:30 AM</p>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-blue-400 transition-all">
                  <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center shadow-sm"><Video size={20} /></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Join Meet</p>
                    <p className="text-sm font-bold text-blue-700 underline flex items-center gap-1">Click to join <ExternalLink size={12} /></p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button onClick={() => window.location.reload()} className="px-12 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all">
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/10" onClick={() => setShowLoginModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-sm rounded-2xl p-6 sm:p-7 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto">
               <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
               
               <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#EFFBFB] text-[var(--color-primary)] rounded-xl flex items-center justify-center mx-auto mb-3">
                     <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-medium">Access Secured</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1.5">Login or register to finalize your meeting with <span className="font-medium text-[var(--color-text)]">{selectedSpec?.name}</span>.</p>
               </div>

               <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white"
                  />
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white"
                  />
                  <button type="submit" className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all shadow-sm">
                    Login & Finalize Meet
                  </button>
               </form>

               <div className="mt-5 flex flex-col items-center gap-3">
                  <div className="w-full h-[1px] bg-gray-100 relative">
                     <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-400 font-bold uppercase">Or</span>
                  </div>
                  <a 
                    href="/auth" 
                    className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    Go to Official Provider Login <ExternalLink size={14} />
                  </a>
               </div>
               
               <div className="mt-4 text-center text-xs text-gray-400">
                  By continuing, you agree to FirstDoer <span className="underline cursor-pointer">Terms of Service</span>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BACK CONFIRMATION MODAL */}
      <AnimatePresence>
        {showBackConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/10" onClick={() => setShowBackConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-xs rounded-2xl p-6 text-center shadow-xl border border-gray-100">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Go back?</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">Are you sure you want to go back? Some of your current entries might be lost.</p>

              <div className="flex gap-3">
                <button onClick={() => setShowBackConfirm(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm uppercase tracking-wider">Cancel</button>
                <button onClick={confirmBack} className="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all text-sm uppercase tracking-wider">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER INFO (MATCHES POST A TASK) */}
      {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
         <span className="flex items-center gap-2"><Shield size={14} className="text-[var(--color-primary)]" /> Verified Specialists</span>
         <span className="flex items-center gap-2"><Lock size={14} className="text-[var(--color-primary)]" /> Secure Messaging</span>
         <span className="flex items-center gap-2"><Video size={14} className="text-[var(--color-primary)]" /> Instant Meetings</span>
      </div> */}
    </div>
  );
}
