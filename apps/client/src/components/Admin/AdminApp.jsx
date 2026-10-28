import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDailyQuizPage from "./pages/AdminDailyQuizPage";

export default function AdminApp() {
  return <Routes>
    <Route index element={<Navigate to="performer-growth/daily-quizzes" replace />} />
    <Route path="performer-growth" element={<Navigate to="/admin/performer-growth/daily-quizzes" replace />} />
    <Route path="performer-growth/daily-quizzes" element={<AdminDailyQuizPage />} />
    {/* Keep the original URL working for existing bookmarks. */}
    <Route path="daily-quizzes" element={<AdminDailyQuizPage />} />
    <Route path="*" element={<Navigate to="performer-growth/daily-quizzes" replace />} />
  </Routes>;
}
