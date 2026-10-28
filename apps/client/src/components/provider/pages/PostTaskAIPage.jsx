import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import AiPostingChatFlow from "../components/AiPostingChatFlow";

const PostTaskAIPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
            <ProviderHeader activePage="my-tasks" />

            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-90"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(139, 92, 246, 0.06), transparent 45%)",
                }}
            />

            <main className="mx-auto flex max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-0 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                        AI-assisted posting
                    </div>
                </div>

                <div className="mx-auto w-full">
                    <AiPostingChatFlow
                        onEditTask={(task) => navigate("/provider/post-task-manual", {
                            state: { aiGeneratedData: task },
                        })}
                        onPosted={(taskId) => navigate(taskId
                            ? `/provider/task-status?taskId=${taskId}`
                            : "/provider/my-tasks", { replace: true })}
                    />
                </div>
            </main>
        </div>
    );
};

export default PostTaskAIPage;
