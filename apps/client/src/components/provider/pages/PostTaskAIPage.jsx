import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import AiPostingChatFlow from "../components/AiPostingChatFlow";

const PostTaskAIPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--dash-canvas)] pb-16 pt-[80px] font-sans text-[var(--dash-text)] antialiased">
      <ProviderHeader activePage="my-tasks" />

      <main className="mx-auto flex max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--dash-active-bg)] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-primary-800)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--dash-primary-700)]" strokeWidth={2.2} aria-hidden="true" />
            <span>AI-assisted posting</span>
          </div>
        </div>

        <div className="mx-auto w-full">
          <AiPostingChatFlow
            onEditTask={(task) =>
              navigate("/provider/post-task-manual", {
                state: { aiGeneratedData: task },
              })
            }
            onPosted={(taskId) =>
              navigate(taskId ? `/provider/task-status?taskId=${taskId}` : "/provider/my-tasks", {
                replace: true,
              })
            }
          />
        </div>
      </main>
    </div>
  );
};

export default PostTaskAIPage;
