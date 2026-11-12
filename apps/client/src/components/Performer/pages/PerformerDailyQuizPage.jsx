import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, Clock3, Flame, LockKeyhole, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PerformerHeader from "../components/PerformerHeader";
import { getDailyQuiz, getDailyQuizHistory, startDailyQuiz, submitDailyQuiz } from "../services/api";

const EASE_OUT = [0.23, 1, 0.32, 1];

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function QuizSkeleton() {
  return <div className="mx-auto max-w-3xl animate-pulse space-y-5 px-4 pb-20 pt-8 sm:px-6"><div className="h-5 w-24 rounded-full bg-slate-200" /><div className="h-52 rounded-[24px] bg-slate-200" /><div className="h-64 rounded-[24px] bg-slate-200" /></div>;
}

function EmptyQuiz({ onBack, message }) {
  return <main className="mx-auto flex min-h-[70dvh] max-w-xl items-center justify-center px-4 py-12 text-center sm:px-6"><div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFFBFB] text-[#10605F]"><Sparkles size={25} strokeWidth={1.8} /></div><h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">No quiz waiting today</h1><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{message || "Check back tomorrow for a short practice set matched to your category."}</p><button type="button" onClick={onBack} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10605F] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,96,95,0.2)] transition-[transform,background-color] duration-150 ease-out hover:bg-[#083B3A] active:scale-[0.98]">Back to growth <ArrowRight size={16} /></button></div></main>;
}

function ResultPanel({ result, quiz, onRetry, onBack }) {
  const passed = result?.passed;
  const timedOut = result?.timedOut;
  return <motion.section initial={{ opacity: 0, transform: "translateY(12px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ duration: 0.22, ease: EASE_OUT }} className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-8"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${passed ? "bg-[#10605F]" : "bg-white/10"}`}>{passed ? <Trophy size={26} /> : <RotateCcw size={25} />}</div><p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#7EDEDD]">{timedOut ? "Time is up" : passed ? "Quiz passed" : "Keep practising"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{timedOut ? "Your next attempt is ready when you are." : passed ? "You cleared today’s set." : "You’re closer than you think."}</h1><p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">{timedOut ? "This attempt was recorded as timed out. Use your next attempt to slow down, read each question, and keep moving." : passed ? `You scored ${result.score}%. Keep the streak alive tomorrow.` : `You scored ${result.score}%. Review the topic and use your remaining attempt wisely.`}</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Score</p><p className="mt-1 text-2xl font-bold">{result.score}%</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Attempts left</p><p className="mt-1 text-2xl font-bold">{result.attemptsRemainingToday}</p></div></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onBack} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10605F] px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-[#083B3A] active:scale-[0.98]">Back to growth <ArrowRight size={16} /></button>{!passed && !timedOut && result.attemptsRemainingToday > 0 ? <button type="button" onClick={onRetry} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-white/10 active:scale-[0.98]">Try again <RotateCcw size={16} /></button> : null}</div><p className="mt-6 text-xs text-slate-500">{quiz?.title}</p></motion.section>;
}

export default function PerformerDailyQuizPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [payload, setPayload] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [quizResponse, historyResponse] = await Promise.all([getDailyQuiz(), getDailyQuizHistory()]);
      setPayload(quizResponse.data);
      setHistory(historyResponse.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not load today’s quiz.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const quiz = payload?.quiz;
  const questions = quiz?.questions || [];
  const currentQuestion = questions[questionIndex];
  const answeredCount = answers.filter((answer) => Number.isInteger(answer)).length;
  const progress = questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = questionIndex === questions.length - 1;

  useEffect(() => {
    if (!attempt?.expiresAt) return undefined;
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [attempt?.expiresAt]);

  const submit = useCallback(async (timedOut = false) => {
    if (!attempt || !quiz || submitting) return;
    setSubmitting(true);
    try {
      const safeAnswers = answers.map((answer) => Number.isInteger(answer) ? answer : 0);
      const response = await submitDailyQuiz(quiz.id, attempt.attemptId, safeAnswers);
      setResult(response.data);
      setAttempt(null);
      setSecondsLeft(null);
      setError("");
      if (timedOut && !response.data?.timedOut) setError("Your time expired while submitting. The server accepted the result.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your answers could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, attempt, quiz, submitting]);

  useEffect(() => {
    if (attempt && secondsLeft === 0 && !submitting) submit(true);
  }, [attempt, secondsLeft, submitting, submit]);

  const begin = async () => {
    if (!quiz) return;
    try {
      const response = await startDailyQuiz(quiz.id);
      setAttempt(response.data);
      setAnswers(Array.isArray(response.data.quiz?.questions) ? response.data.quiz.questions.map(() => null) : questions.map(() => null));
      setQuestionIndex(0);
      setResult(null);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This quiz could not be started.");
    }
  };

  const resetForRetry = () => {
    setResult(null);
    setAnswers([]);
    setQuestionIndex(0);
    begin();
  };

  const currentAnswer = answers[questionIndex];
  const streak = history?.streakDays || 0;
  const bestScore = history?.bestScore || 0;

  if (loading) return <><PerformerHeader /><QuizSkeleton /></>;
  if (error && !payload) return <><PerformerHeader /><main className="mx-auto max-w-xl px-4 py-16 sm:px-6"><div role="alert" className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-800">{error}<button type="button" onClick={load} className="ml-2 font-bold underline">Try again</button></div></main></>;
  if (!payload?.available || !quiz) return <><PerformerHeader /><EmptyQuiz onBack={() => navigate("/performer/growth")} message={payload?.message} /></>;

  return <div className="min-h-screen bg-[#f5f7f7] text-slate-950"><PerformerHeader /><main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10"><div className="mb-6 flex items-center justify-between gap-3"><button type="button" onClick={() => navigate("/performer/growth")} className="inline-flex min-h-10 items-center gap-1 rounded-full px-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#083B3A] active:scale-[0.98]"><ChevronLeft size={18} /> Growth</button><div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700"><Flame size={16} /> {streak} day streak</div></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]"><section><div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7EDEDD]">Daily practice · {quiz.category}</p><h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{quiz.title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{quiz.description || "A short practice set to sharpen your edge and keep your growth streak moving."}</p></div>{attempt ? <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${secondsLeft <= 30 ? "bg-rose-500/20 text-rose-200" : "bg-white/10 text-white"}`}><Clock3 size={16} /> {formatTime(secondsLeft)}</div> : <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-300">{quiz.timeLimitSeconds ? formatTime(quiz.timeLimitSeconds) : `${quiz.questions.length * (quiz.secondsPerQuestion || 30)} sec`}</div>}</div><div className="mt-7 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${attempt ? progress : 0}%` }} transition={{ duration: reduceMotion ? 0 : 0.18, ease: EASE_OUT }} className="h-full rounded-full bg-emerald-400" /></div><span className="text-xs font-semibold text-slate-400">{attempt ? `${questionIndex + 1}/${questions.length}` : `${questions.length} questions`}</span></div></div>{error ? <div role="alert" className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}{result ? <div className="mt-5"><ResultPanel result={result} quiz={quiz} onRetry={resetForRetry} onBack={() => navigate("/performer/growth")} /></div> : !attempt ? <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFFBFB] text-[#10605F]"><Clock3 size={23} /></div><div><h2 className="text-xl font-bold text-slate-950">Ready when you are</h2><p className="mt-1 text-sm leading-6 text-slate-600">You’ll have {formatTime(quiz.timeLimitSeconds || questions.length * (quiz.secondsPerQuestion || 30))} total. The deadline is enforced by the server, so your timer stays fair.</p></div></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Pass mark</p><p className="mt-1 text-lg font-bold">{quiz.passingScore}%</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Attempts left</p><p className="mt-1 text-lg font-bold">{quiz.attemptsRemaining}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Reward</p><p className="mt-1 text-lg font-bold">Keep your streak</p></div></div><button type="button" onClick={begin} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#10605F] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,96,95,0.2)] transition-[transform,background-color] duration-150 ease-out hover:bg-[#083B3A] active:scale-[0.98] sm:w-auto">Start today’s quiz <ArrowRight size={17} /></button></section> : <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8"><AnimatePresence mode="wait"><motion.div key={questionIndex} initial={reduceMotion ? false : { opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={reduceMotion ? undefined : { opacity: 0, transform: "translateY(-6px)" }} transition={{ duration: 0.18, ease: EASE_OUT }}><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#10605F]">Question {questionIndex + 1}</p><h2 className="mt-3 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">{currentQuestion?.prompt}</h2><div className="mt-6 grid gap-3">{(currentQuestion?.choices || []).map((choice, index) => <button key={`${choice}-${index}`} type="button" onClick={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = index; return next; })} className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left text-sm font-semibold transition-[border-color,background-color,transform] duration-150 ease-out active:scale-[0.98] ${currentAnswer === index ? "border-[#10605F] bg-[#EFFBFB] text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-[#29ADAC]/30 hover:bg-[#EFFBFB]/40"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${currentAnswer === index ? "border-[#10605F] bg-[#10605F] text-white" : "border-slate-300 text-slate-500"}`}>{currentAnswer === index ? <Check size={15} /> : String.fromCharCode(65 + index)}</span>{choice}</button>)}</div></motion.div></AnimatePresence><div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">{answeredCount} of {questions.length} answered</p><div className="flex gap-2"><button type="button" disabled={questionIndex === 0} onClick={() => setQuestionIndex((current) => current - 1)} className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">Back</button>{isLastQuestion ? <button type="button" disabled={answeredCount !== questions.length || submitting} onClick={() => submit(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10605F] px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-[#083B3A] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">{submitting ? "Submitting…" : "Submit quiz"}<ArrowRight size={16} /></button> : <button type="button" disabled={!Number.isInteger(currentAnswer)} onClick={() => setQuestionIndex((current) => current + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10605F] px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-[#083B3A] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">Next <ArrowRight size={16} /></button>}</div></div></section>}</section><aside className="space-y-4"><div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"><div className="flex items-center gap-2 text-sm font-bold text-slate-950"><Flame size={18} className="text-orange-500" /> Streak health</div><p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">{streak}<span className="ml-2 text-sm font-semibold text-slate-500">days</span></p><p className="mt-1 text-xs leading-5 text-slate-500">Pass one quiz on consecutive days to keep it alive.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-400" style={{ width: `${Math.min(streak * 14, 100)}%` }} /></div></div><div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"><div className="flex items-center gap-2 text-sm font-bold text-slate-950"><Trophy size={18} className="text-[#10605F]" /> Your best</div><p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">{bestScore}<span className="ml-1 text-lg">%</span></p><p className="mt-1 text-xs leading-5 text-slate-500">Strong scores help you build evidence for your growth plan.</p></div><div className="rounded-[24px] bg-[#0D1210] p-5 text-white"><div className="flex items-center gap-2 text-sm font-bold"><LockKeyhole size={17} className="text-[#7EDEDD]" /> Fair by design</div><p className="mt-3 text-xs leading-5 text-[#EFFBFB]/80">Your answers stay private. Only your score and completion are used for growth rewards.</p></div></aside></div></main></div>;
}
