import React, { useState } from 'react';
import { Cpu, Loader, AlertCircle } from 'react-feather';

/**
 * AITaskInput Component
 * Provides natural language input interface for AI-powered task generation
 */
export default function AITaskInput({ onGenerate, isLoading, error }) {
  const [prompt, setPrompt] = useState('');
  const MAX_CHARS = 2000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={20} className="text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            AI Task Generator
          </h3>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Describe what you need in your own words, and our AI will create a structured task for you.
        </p>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I need someone to research 10 competitors in my niche and create a comparison spreadsheet with their pricing, features, and target audience..."
            disabled={isLoading}
            className={`w-full min-h-[140px] rounded-xl border-2 px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none resize-none transition-all ${
              isOverLimit
                ? 'border-red-500 focus:border-red-500 bg-red-50'
                : error
                ? 'border-red-400 focus:border-red-400 bg-red-50'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] bg-[var(--color-surface)] focus:bg-white'
            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            rows={6}
          />

          {/* Character Counter */}
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${
            isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-[var(--color-text-subtle)]'
          }`}>
            {charCount} / {MAX_CHARS}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || isOverLimit}
          className="w-full sm:w-auto min-w-[200px] rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Generating Task...</span>
            </>
          ) : (
            <>
              <Cpu size={18} />
              <span>Generate Task</span>
            </>
          )}
        </button>

        {/* Helper Text */}
        {!error && (
          <p className="text-xs text-[var(--color-text-subtle)] mt-2">
            💡 Tip: Be as specific as possible for better results. Include details about deliverables, timeline, and any special requirements.
          </p>
        )}
      </form>
    </div>
  );
}
