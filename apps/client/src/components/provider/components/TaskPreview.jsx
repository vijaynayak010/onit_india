import React from 'react';
import { CheckCircle, Clock, DollarSign, Tag, HelpCircle, RefreshCw } from 'react-feather';
import ClarityScore from './ClarityScore';

/**
 * TaskPreview Component
 * Displays AI-generated task structure for user review
 */
export default function TaskPreview({ taskData, onUseTask, onRegenerate }) {
  // Calculate clarity score based on description length
  const calculateClarityScore = () => {
    const descLength = taskData.description.length;
    return descLength < 100 ? 60 : 90;
  };

  const clarityScore = calculateClarityScore();

  return (
    <div className="w-full rounded-2xl border-2 border-[var(--color-primary)]/20 bg-white shadow-[var(--shadow-lg)] overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={20} />
            AI Generated Task
          </h3>
          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition"
          >
            <RefreshCw size={14} />
            Regenerate
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Clarity Score */}
        <ClarityScore score={clarityScore} />

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
            Task Title
          </label>
          <h4 className="text-xl font-bold text-[var(--color-text)]">
            {taskData.title}
          </h4>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
            Description
          </label>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {taskData.description}
          </p>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
            Required Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {taskData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary-subtle)] text-[var(--color-primary)] text-sm font-medium border border-[var(--color-primary)]/20"
              >
                <Tag size={14} />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Budget and Time - Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Budget */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-[var(--color-primary)]" />
              <label className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                Budget Range
              </label>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {taskData.budget_range}
            </p>
          </div>

          {/* Estimated Time */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-[var(--color-primary)]" />
              <label className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                Estimated Time
              </label>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {taskData.estimated_time}
            </p>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
            Category
          </label>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white font-semibold">
            {taskData.task_category}
          </span>
        </div>

        {/* Clarification Questions */}
        {taskData.clarification_questions && taskData.clarification_questions.length > 0 && (
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-900 mb-1">
                  Clarification Needed
                </h5>
                <p className="text-sm text-yellow-700">
                  Please provide more details about:
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-6">
              {taskData.clarification_questions.map((question, index) => (
                <li key={index} className="text-sm text-yellow-800 list-disc">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onUseTask}
          className="w-full rounded-xl bg-[var(--color-primary)] px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Use This Task
        </button>
      </div>
    </div>
  );
}
