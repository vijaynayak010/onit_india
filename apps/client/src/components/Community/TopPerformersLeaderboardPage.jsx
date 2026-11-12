import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, Star } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

// Example leaderboard data. Replace with API when available (e.g. top performers by rating + completed count).
const LEADERBOARD = [
  { rank: 1, name: "Priya M.", tasksCompleted: 127, rating: 4.9, category: "Research & Data" },
  { rank: 2, name: "Rahul K.", tasksCompleted: 98, rating: 4.9, category: "Content & Design" },
  { rank: 3, name: "Anita S.", tasksCompleted: 86, rating: 4.8, category: "Business Research" },
  { rank: 4, name: "Vikram P.", tasksCompleted: 72, rating: 4.8, category: "Design & Marketing" },
  { rank: 5, name: "Sneha R.", tasksCompleted: 65, rating: 4.9, category: "Data & Admin" },
  { rank: 6, name: "Arjun D.", tasksCompleted: 58, rating: 4.7, category: "Content & SEO" },
  { rank: 7, name: "Meera L.", tasksCompleted: 54, rating: 4.8, category: "Research" },
  { rank: 8, name: "Karan J.", tasksCompleted: 49, rating: 4.8, category: "Design" },
  { rank: 9, name: "Divya N.", tasksCompleted: 45, rating: 4.9, category: "Writing & Editing" },
  { rank: 10, name: "Rohan T.", tasksCompleted: 42, rating: 4.7, category: "Field & Local" },
];

const TopPerformersLeaderboardPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Top Performers Leaderboard | FirstDoer"
      description="Top task performers on FirstDoer by completed tasks and ratings. See who's delivering great work on the platform."
      keywords="FirstDoer leaderboard, top performers, best task performers, task marketplace India ratings"
      canonical="https://www.firstdoer.com/community/top-performers"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm mb-8 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Award size={24} className="text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
              Top Performers Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Performers with high completed task counts and ratings. This list reflects real platform activity and can be updated periodically.
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-primary)]/15">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/15">
                <th className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">Rank</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">Performer</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">Tasks completed</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">Rating</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--color-primary)] hidden sm:table-cell">Category</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((row) => (
                <tr
                  key={row.rank}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-sm font-bold ${
                      row.rank <= 3 ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-700"
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.tasksCompleted}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <Star size={14} fill="currentColor" />
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm hidden sm:table-cell">{row.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          Leaderboard is illustrative. When connected to your backend, it can be driven by real performer stats (e.g. completed tasks, average rating, time period).
        </p>

        <div className="mt-10 text-center">
          <Link
            to="/task-performers"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Join as a performer
          </Link>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TopPerformersLeaderboardPage;
