import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";

const ReviewModal = ({ isOpen, onClose, onSubmit, targetName, role }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ rating, comment });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setComment("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Review submission failed:", err);
      alert(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting ? onClose : undefined}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/20 bg-white shadow-2xl p-8 sm:p-10"
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                >
                  <CheckCircle2 size={48} strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                <p className="font-bold text-slate-400">Your feedback has been shared.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Button */}
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          )}

          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Star size={32} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Rate your experience</h2>
            <p className="mt-2 text-lg font-bold text-slate-400">
              How was working with <span className="text-emerald-600">{targetName || "the performer"}</span>?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {/* Star Rating Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isSubmitting}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="relative transition-transform active:scale-90"
                  >
                    <Star
                      size={48}
                      strokeWidth={1.5}
                      className={`transition-colors duration-200 ${
                        (hover || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 hover:text-slate-300"
                      }`}
                    />
                    {hover === star && (
                       <motion.div 
                        layoutId="star-glow"
                        className="absolute inset-0 blur-xl bg-amber-400/20 rounded-full" 
                       />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-slate-300">
                {rating === 5 ? "Exceptional!" : rating === 4 ? "Great Job" : rating === 3 ? "Good" : rating === 2 ? "Could be better" : rating === 1 ? "Disappointing" : "Select a rating"}
              </span>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <MessageSquare size={18} className="text-emerald-500" />
                <label className="text-sm font-black uppercase tracking-widest">Share more details</label>
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 transition-focus-within focus-within:border-emerald-500/30">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                  placeholder={`Tell us what was great or how they can improve...`}
                  className="min-h-[120px] w-full resize-none bg-transparent p-5 text-[15px] font-semibold text-slate-800 placeholder:text-slate-300 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex w-full items-center justify-center gap-3 rounded-[1.25rem] bg-slate-900 py-5 text-lg font-black text-white shadow-xl transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Review
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
