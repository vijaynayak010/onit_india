import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import ProviderSettingsSidebar from "../components/ProviderSettingsSidebar";
import { accountMainClass, accountMainStyle } from "../../common/account/AccountFlatNav";

const PERFORMER_APP_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.onitconsumer.india&pcampaignid=web_share";

const InfoCard = ({ icon: Icon, title, description, cardBg, iconBg, iconColor }) => (
  <div className={`flex items-start gap-4 rounded-2xl p-5 ${cardBg}`}>
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
      <Icon size={20} className={iconColor} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 text-left">
      <h3 className="text-[15px] font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  </div>
);

const SwitchToPerformerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
      <ProviderHeader activePage="home" />

      <div className="relative flex flex-1">
        <ProviderSettingsSidebar />

        <main className={accountMainClass} style={accountMainStyle}>
          <div className="mx-auto w-full max-w-xl">
            <button
              type="button"
              onClick={() => navigate("/provider/settings?tab=settings")}
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              Back to Settings
            </button>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-purple-200/60">
                  <Star size={52} className="text-white" fill="white" strokeWidth={0} />
                </div>
              </div>

              <h1 className="text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
                Become a Performer
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                Join thousands of performers and start earning by sharing your talent with the world.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <InfoCard
                icon={TrendingUp}
                title="Grow Your Audience"
                description="Reach millions of fans and build your personal brand."
                cardBg="bg-purple-50/80"
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
              <InfoCard
                icon={Zap}
                title="Start Earning Instantly"
                description="Get paid for every performance and live session."
                cardBg="bg-pink-50/80"
                iconBg="bg-pink-100"
                iconColor="text-pink-600"
              />
              <InfoCard
                icon={ShieldCheck}
                title="Verified & Secure"
                description="Your profile and earnings are fully protected."
                cardBg="bg-[#EFFBFB]/80"
                iconBg="bg-[#DFF7F6]"
                iconColor="text-[#10605F]"
              />
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left text-sm leading-relaxed text-amber-900">
              <p>
                <strong>Note:</strong> The Performer experience is available on our dedicated Performer App.
                Download it from the Play Store to get started.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <a
                href={PERFORMER_APP_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get FirstDoer Performer on Google Play"
                className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-black px-6 py-3.5 transition hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </a>
              <p className="mt-4 max-w-sm text-center text-xs leading-relaxed text-gray-500">
                Download the Performer App and sign in with your existing account.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SwitchToPerformerPage;
