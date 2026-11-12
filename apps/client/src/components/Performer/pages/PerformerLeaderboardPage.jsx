import React, { useState, useEffect } from "react";
import { TrendingUp, Crown, Gem, Loader2 } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { getMyTaskerRanking } from "../services/api";
import { mapRankedTasker, mapRankedTaskers } from "../../../utils/taskerRankings";

const avatarFor = (t, bg = "059669") =>
  t?.profilePicUrl ||
  t?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(t?.displayName || "P")}&background=${bg}&color=fff`;

const PerformerLeaderboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [podium, setPodium] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [myRow, setMyRow] = useState(null);
  const [category, setCategory] = useState(null);
  const [inTop, setInTop] = useState(true);
  const [statsData, setStatsData] = useState({
    totalParticipants: 0,
    myRank: "—",
    rankingScore: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const res = await getMyTaskerRanking({ limit: 10 });
        const me = res?.data ? mapRankedTasker(res.data) : null;
        const board = mapRankedTaskers(res?.leaderboard || []);
        const myId = me?.taskerId || me?.id;

        const isMe = (t) =>
          myId && (t.taskerId === myId || t.id === myId || t.userId === me?.userId);

        const podiumData = [];
        if (board[0]) {
          podiumData.push({
            id: board[0].id,
            name: board[0].displayName,
            title: board[0].profession,
            rank: board[0].rank || 1,
            tasks: board[0].completedTasksCount,
            score: board[0].rankingScore,
            img: avatarFor(board[0], "059669"),
            featured: true,
            podiumRank: 1,
            isMe: isMe(board[0]),
          });
        }
        if (board[1]) {
          podiumData.push({
            id: board[1].id,
            name: board[1].displayName,
            title: board[1].profession,
            rank: board[1].rank || 2,
            tasks: board[1].completedTasksCount,
            score: board[1].rankingScore,
            img: avatarFor(board[1], "0284c7"),
            podiumRank: 2,
            isMe: isMe(board[1]),
          });
        }
        if (board[2]) {
          podiumData.push({
            id: board[2].id,
            name: board[2].displayName,
            title: board[2].profession,
            rank: board[2].rank || 3,
            tasks: board[2].completedTasksCount,
            score: board[2].rankingScore,
            img: avatarFor(board[2], "d97706"),
            podiumRank: 3,
            isMe: isMe(board[2]),
          });
        }

        const visualPodium = [
          podiumData.find((p) => p.podiumRank === 2),
          podiumData.find((p) => p.podiumRank === 1),
          podiumData.find((p) => p.podiumRank === 3),
        ].filter(Boolean);

        const tableData = board.slice(3, 10).map((t) => {
          const status = t.kycStatus === "VERIFIED" ? "Verified" : "Active";
          const statusClass =
            t.kycStatus === "VERIFIED"
              ? "bg-[#EFFBFB] text-[#10605F] ring-1 ring-[#29ADAC]/30"
              : "bg-[var(--color-border-subtle)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)]";
          return {
            rank: t.rank,
            name: t.displayName,
            joined: t.stats?.lastActivityAt
              ? `Active ${new Date(t.stats.lastActivityAt).toLocaleDateString([], { month: "short", day: "numeric" })}`
              : "Recently active",
            specialization: t.profession,
            tasks: t.completedTasksCount,
            score: t.rankingScore,
            status,
            statusClass,
            img: avatarFor(t, "64748b"),
            isMe: isMe(t),
          };
        });

        setPodium(visualPodium);
        setTableRows(tableData);
        setMyRank(me?.rank ?? null);
        setMyRow(me);
        setCategory(res?.category || null);
        setInTop(Boolean(res?.currentTaskerInTopResults));
        setStatsData({
          totalParticipants: Number(res?.totalRanked) || board.length,
          myRank: me?.rank != null ? `#${me.rank}` : "Unranked",
          rankingScore: me?.rankingScore ?? 0,
          completedTasks: me?.completedTasksCount ?? 0,
        });
      } catch (err) {
        console.error("Failed to load rankings:", err);
        setPodium([]);
        setTableRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const footerStats = [
    {
      label: "Total ranked",
      value: statsData.totalParticipants.toLocaleString(),
      tone: "sky",
    },
    {
      label: "Category",
      value: category || "Overall",
      tone: "emerald",
    },
    {
      label: "Your rank",
      value: statsData.myRank,
      tone: "amber",
    },
    {
      label: "Your score",
      value: String(statsData.rankingScore),
      tone: "violet",
    },
  ];

  const toneRing = {
    sky: "bg-sky-50 text-sky-600 ring-sky-200/70",
    emerald: "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] ring-[var(--color-primary)]/20",
    amber: "bg-amber-50 text-amber-700 ring-amber-200/70",
    violet: "bg-violet-50 text-violet-700 ring-violet-200/70",
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="leaderboard" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-6xl pb-12">
          <PerformerPageHeader
            title="Leaderboard"
            subtitle={`Rankings for ${category || "your best category"} based on profile quality, ratings, completions, and activity`}
            backTo="/performer/account"
            actions={
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
                Live rankings
              </div>
            }
          />

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4 text-[#10605F]">
            <Loader2 className="h-10 w-10 animate-spin" strokeWidth={2.5} />
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading rankings…</p>
          </div>
        ) : (
          <>
            {/* Your rank (always shown from data) */}
            {myRow ? (
              <section className="mb-8 rounded-[var(--radius-2xl)] border border-[var(--color-primary)]/25 bg-[var(--color-primary-subtle)]/30 p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">Your rank</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={avatarFor(myRow)} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white" />
                    <div>
                      <p className="text-xl font-bold text-[var(--color-text)]">{myRow.displayName}</p>
                      <p className="text-sm font-semibold text-[var(--color-text-muted)]">{myRow.profession}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black tabular-nums text-[var(--color-text)]">
                      {myRank != null ? `#${myRank}` : "—"}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                      Score {myRow.rankingScore ?? 0}
                      {!inTop && myRank != null ? " · Outside top 10" : ""}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            <section aria-label="Top three performers" className="mb-12 lg:mb-16">
              <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3 md:gap-5 lg:gap-8">
                {podium.length === 0 ? (
                  <p className="col-span-full rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center text-sm font-semibold text-[var(--color-text-muted)]">
                    No ranked performers in this category yet.
                  </p>
                ) : (
                  podium.map((p) => (
                    <div
                      key={p.id}
                      className={`relative flex flex-col items-center rounded-[var(--radius-2xl)] border p-6 text-center shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] ${
                        p.isMe
                          ? "border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20 md:-mt-2 md:scale-[1.02] md:pb-8 md:pt-10 bg-gradient-to-b from-[var(--color-primary-subtle)]/20 to-white"
                          : p.featured
                            ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15 md:-mt-2 md:scale-[1.02] md:pb-8 md:pt-10 bg-[var(--color-surface-elevated)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
                      }`}
                    >
                      {p.featured ? (
                        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center text-[var(--color-primary)]">
                          <Crown className="h-10 w-10 fill-current" strokeWidth={1} />
                        </div>
                      ) : null}
                      <div className={`relative mb-5 ${p.featured ? "mt-4" : ""}`}>
                        <div className={`mx-auto overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-[var(--color-border)] ${p.featured ? "h-32 w-32" : "h-24 w-24"}`}>
                          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] text-xs font-bold text-white shadow-sm">
                          {p.podiumRank}
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-text)]">{p.name}{p.isMe ? " (You)" : ""}</h3>
                      <p className={`mt-0.5 text-xs font-semibold uppercase tracking-wider ${p.isMe ? "text-[var(--color-primary)]" : "text-sky-600"}`}>{p.title}</p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-200/80">
                        <Gem className="h-4 w-4 text-sky-600" strokeWidth={2} />
                        Score {p.score} · {p.tasks} tasks
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section aria-label="Ranks 4 through 10" className="mb-12 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] lg:mb-16">
              <div className="flex flex-col gap-2 border-b border-[var(--color-border)] bg-[var(--color-primary-subtle)]/35 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <h2 className="text-lg font-bold text-[var(--color-text)]">Top performers</h2>
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {category ? `${category} category` : "Overall"} · top 10
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-subtle)]">
                      <th className="whitespace-nowrap px-5 py-4 sm:px-8">Rank</th>
                      <th className="whitespace-nowrap px-5 py-4 sm:px-8">Performer</th>
                      <th className="whitespace-nowrap px-5 py-4 sm:px-8">Specialization</th>
                      <th className="whitespace-nowrap px-5 py-4 text-center sm:px-8">Score</th>
                      <th className="whitespace-nowrap px-5 py-4 text-right sm:px-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {tableRows.length > 0 ? (
                      <>
                        {tableRows.map((row) => (
                          <tr
                            key={`${row.rank}-${row.name}`}
                            className={`transition-colors ${
                              row.isMe
                                ? "bg-[var(--color-primary-subtle)]/40 border-y border-[var(--color-primary)]/20 font-semibold"
                                : "hover:bg-[var(--color-primary-subtle)]/20"
                            }`}
                          >
                            <td className="whitespace-nowrap px-5 py-5 text-base font-bold tabular-nums sm:px-8">{row.rank}</td>
                            <td className="px-5 py-5 sm:px-8">
                              <div className="flex items-center gap-4">
                                <img src={row.img} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-[var(--color-border)]" />
                                <div>
                                  <p className="font-bold">{row.name}{row.isMe ? " (You)" : ""}</p>
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">{row.joined}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 text-sm font-medium text-[var(--color-text-muted)] sm:px-8">{row.specialization}</td>
                            <td className="px-5 py-5 text-center text-sm font-bold tabular-nums sm:px-8">{row.score}</td>
                            <td className="px-5 py-5 text-right sm:px-8">
                              <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${row.statusClass}`}>{row.status}</span>
                            </td>
                          </tr>
                        ))}

                        {!inTop && myRank != null && myRow ? (
                          <>
                            <tr className="bg-[var(--color-border-subtle)]/10">
                              <td colSpan="5" className="px-5 py-2 text-center text-xs font-semibold text-[var(--color-text-subtle)]">• • •</td>
                            </tr>
                            <tr className="bg-[var(--color-primary-subtle)]/40 border-y border-[var(--color-primary)]/20 font-semibold">
                              <td className="whitespace-nowrap px-5 py-5 text-base font-bold tabular-nums sm:px-8">{myRank}</td>
                              <td className="px-5 py-5 sm:px-8">
                                <div className="flex items-center gap-4">
                                  <img src={avatarFor(myRow)} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-[var(--color-primary)]/30" />
                                  <div>
                                    <p className="font-bold">{myRow.displayName} (You)</p>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Your rank outside top 10</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-5 text-sm font-medium text-[var(--color-text-muted)] sm:px-8">{myRow.profession}</td>
                              <td className="px-5 py-5 text-center text-sm font-bold tabular-nums sm:px-8">{myRow.rankingScore}</td>
                              <td className="px-5 py-5 text-right sm:px-8">
                                <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide bg-[#EFFBFB] text-[#10605F] ring-1 ring-[#29ADAC]/30">You</span>
                              </td>
                            </tr>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-sm font-semibold text-[var(--color-text-muted)]">
                          Leaderboard is empty for this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {footerStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 text-sm font-black ${toneRing[stat.tone]}`}>
                    {String(stat.value).slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">{stat.label}</p>
                    <p className="mt-1 truncate text-2xl font-bold tabular-nums tracking-tight text-[var(--color-text)] sm:text-3xl">{stat.value}</p>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
        </div>
      </main>
    </div>
  );
};

export default PerformerLeaderboardPage;
