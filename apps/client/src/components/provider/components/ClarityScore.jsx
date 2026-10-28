import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'react-feather';

/**
 * ClarityScore Component
 * Displays task clarity percentage with visual indicator
 */
export default function ClarityScore({ score }) {
  const getScoreLevel = () => {
    if (score < 70) return 'low';
    if (score < 85) return 'medium';
    return 'high';
  };

  const getScoreColor = () => {
    const level = getScoreLevel();
    if (level === 'low') return 'text-red-600 bg-red-100 border-red-200';
    if (level === 'medium') return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getProgressColor = () => {
    const level = getScoreLevel();
    if (level === 'low') return 'bg-red-500';
    if (level === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getIcon = () => {
    const level = getScoreLevel();
    if (level === 'low') return <AlertCircle size={16} />;
    if (level === 'medium') return <Info size={16} />;
    return <CheckCircle size={16} />;
  };

  const getSuggestion = () => {
    if (score < 70) {
      return 'Consider adding more details to improve task clarity';
    }
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Score Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">
          Task Clarity:
        </span>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${getScoreColor()}`}>
          {getIcon()}
          <span>{score}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Suggestion */}
      {getSuggestion() && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          💡 {getSuggestion()}
        </p>
      )}
    </div>
  );
}
