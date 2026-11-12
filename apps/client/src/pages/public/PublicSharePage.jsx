import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiUrl } from "../../config/apiBase";
import SEO from "../../components/seo/SEO";
import "./publicPages.css";

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.onitconsumer.india";
const APP_STORE = "https://apps.apple.com/in/search?term=onit%20india";

function initialShare(code) {
  if (typeof window === "undefined") return null;
  const payload = window.__ONIT_SSR__;
  return payload?.kind === "share" && payload.code === code ? payload.data : null;
}

const list = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);
const money = (amount, currency = "INR") => {
  if (amount == null || amount === "") return null;
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

function AppButtons({ href, playStore = PLAY_STORE }) {
  return (
    <div className="public-app-actions">
      <a className="public-primary-button" href={href}>Open in OnIT app <span aria-hidden="true">↗</span></a>
      <div className="public-store-links">
        <a href={playStore} target="_blank" rel="noreferrer">Google Play</a>
        <a href={APP_STORE} target="_blank" rel="noreferrer">App Store</a>
      </div>
    </div>
  );
}

function ChipList({ items }) {
  const values = list(items);
  if (!values.length) return null;
  return <div className="public-chip-list">{values.map((item, i) => <span className="public-chip" key={`${item}-${i}`}>{item}</span>)}</div>;
}

function ShareContent({ data, code }) {
  if (!data) {
    return <main className="public-state"><span className="public-eyebrow">ONIT INDIA</span><h1>This link is no longer available</h1><p>It may have expired or been turned off by the person who shared it.</p><AppButtons href="https://www.firstdoer.com/" /></main>;
  }
  if (data.available === false) {
    return <main className="public-state"><span className="public-eyebrow">ONIT INDIA</span><h1>This link is no longer available</h1><p>It may have expired or been turned off by the person who shared it.</p><AppButtons href={`https://www.firstdoer.com/s/${encodeURIComponent(code)}`} /></main>;
  }
  if (data.type === "TASK" && data.task) {
    const task = data.task;
    const price = money(task.priceAmount, task.currency);
    const range = task.budgetMinAmount != null || task.budgetMaxAmount != null
      ? [money(task.budgetMinAmount, task.currency), money(task.budgetMaxAmount, task.currency)].filter(Boolean).join(" – ")
      : null;
    return (
      <main className="public-page">
        <header className="public-brand"><a href="/" aria-label="OnIT home"><span className="public-brand-mark">O</span> ONIT INDIA</a><span>Task shared{data.sharedBy?.name ? ` by ${data.sharedBy.name}` : ""}</span></header>
        <article className="public-card">
          <div className="public-eyebrow">{[task.category, task.subcategory, task.service].filter(Boolean).join(" · ") || "TASK"}</div>
          <h1>{task.title || "Task on OnIT"}</h1>
          <div className="public-task-status"><span className={task.isOpen ? "public-dot" : "public-dot public-dot-muted"} />{task.isOpen ? "Accepting performers" : "This task is no longer accepting performers"}</div>
          {task.description && <p className="public-description">{task.description}</p>}
          <div className="public-facts">
            {price && <div><span>Price</span><strong>{price}</strong></div>}
            {range && <div><span>Budget range</span><strong>{range}</strong></div>}
            {task.locationHint && <div><span>Location</span><strong>{task.locationHint}{task.isRemote ? " · Remote available" : ""}</strong></div>}
            {task.dueAt && <div><span>Due date</span><strong>{new Date(task.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>}
            {task.publishedAt && <div><span>Published</span><strong>{new Date(task.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>}
            {task.status && <div><span>Task status</span><strong>{task.status}</strong></div>}
            {task.isRemote != null && <div><span>Work mode</span><strong>{task.isRemote ? "Remote" : "On site"}</strong></div>}
            {task.interestCount != null && <div><span>Interested</span><strong>{task.interestCount} performers</strong></div>}
          </div>
          <ChipList items={task.skills} />
          {task.provider && <section className="public-person">
            {task.provider.profilePicUrl ? <img src={task.provider.profilePicUrl} alt="" /> : <span className="public-avatar">{task.provider.name?.[0] || "O"}</span>}
            <div><span>Posted by</span><strong>{task.provider.name || "OnIT member"}</strong><small>{[task.provider.city, task.provider.ratingAvg != null ? `★ ${task.provider.ratingAvg} (${task.provider.ratingCount || 0})` : null].filter(Boolean).join(" · ")}</small></div>
          </section>}
          <AppButtons href={`https://www.firstdoer.com/s/${encodeURIComponent(code)}`} playStore="https://play.google.com/store/apps/details?id=com.onitapp.india" />
          <div className="public-powered">Work gets done. OnIT.</div>
        </article>
      </main>
    );
  }
  if (data.type === "PERFORMER" && data.performer) {
    const person = data.performer;
    return (
      <main className="public-page">
        <header className="public-brand"><a href="/" aria-label="OnIT home"><span className="public-brand-mark">O</span> ONIT INDIA</a><span>Performer profile</span></header>
        <article className="public-card">
          <section className="public-profile-heading">
            {person.profilePicUrl ? <img src={person.profilePicUrl} alt="" /> : <span className="public-avatar public-avatar-large">{person.displayName?.[0] || "O"}</span>}
            <div><div className="public-eyebrow">{[person.profession, person.domain].filter(Boolean).join(" · ")}</div><h1>{person.displayName || "OnIT Performer"}</h1>
              {person.isKycVerified && <span className="public-verified">✓ Verified</span>}
              <p>{[person.city, person.experienceLevel].filter(Boolean).join(" · ")}</p>
            </div>
          </section>
          {person.bio && <p className="public-description">{person.bio}</p>}
          <div className="public-facts">
            {person.ratingAvg != null && <div><span>Rating</span><strong>★ {person.ratingAvg} ({person.ratingCount || 0})</strong></div>}
            {person.completedTasksCount != null && <div><span>Tasks completed</span><strong>{person.completedTasksCount}</strong></div>}
            {person.memberSince && <div><span>On OnIT since</span><strong>{new Date(person.memberSince).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</strong></div>}
            {list(person.languages).length > 0 && <div><span>Languages</span><strong>{list(person.languages).join(", ")}</strong></div>}
          </div>
          <ChipList items={person.skills} />
          {list(person.portfolio).length > 0 && <section className="public-section"><h2>Portfolio</h2><div className="public-portfolio">{list(person.portfolio).map((item, i) => {
            const url = typeof item === "string" ? item : item.url || item.imageUrl;
            return url ? <a href={url} target="_blank" rel="noreferrer" key={url + i}>{item.title || "View work"} ↗</a> : null;
          })}</div></section>}
          {list(person.recentReviews).length > 0 && <section className="public-section"><h2>Recent reviews</h2>{list(person.recentReviews).slice(0, 3).map((review, i) => <blockquote className="public-review" key={review.id || i}><div>★ {review.rating ?? review.ratingAvg ?? ""}</div><p>{review.comment || review.review || review.text}</p><small>{review.reviewerName || review.name || "OnIT member"}</small></blockquote>)}</section>}
          <AppButtons href={`https://www.firstdoer.com/s/${encodeURIComponent(code)}`} />
          <div className="public-powered">Work gets done. OnIT.</div>
        </article>
      </main>
    );
  }
  return <main className="public-state"><span className="public-eyebrow">ONIT INDIA</span><h1>This link is no longer available</h1><p>We couldn’t find anything to show here.</p><AppButtons href="https://www.firstdoer.com/" /></main>;
}

export default function PublicSharePage() {
  const { code = "" } = useParams();
  const [data, setData] = useState(() => initialShare(code));
  const [loading, setLoading] = useState(!initialShare(code));
  const opened = useRef(false);

  useEffect(() => {
    let active = true;
    const getShare = async () => {
      if (data) return;
      setLoading(true);
      try {
        const response = await fetch(getApiUrl(`/public/share/${encodeURIComponent(code)}`), { cache: "no-store" });
        if (response.status === 404) {
          if (active) setData({ available: false });
          return;
        }
        if (!response.ok) throw new Error("Unable to load this shared link");
        const result = await response.json();
        if (active) setData(result);
      } catch {
        if (active) setData({ available: false });
      } finally {
        if (active) setLoading(false);
      }
    };
    getShare();
    return () => { active = false; };
  }, [code, data]);

  useEffect(() => {
    if (opened.current || !code) return;
    opened.current = true;
    fetch(getApiUrl(`/public/share/${encodeURIComponent(code)}/open`), { method: "POST", cache: "no-store" }).catch(() => {});
  }, [code]);

  const title = data?.type === "TASK" ? data.task?.title : data?.performer?.displayName;
  const description = data?.type === "TASK" ? data.task?.description : data?.performer?.bio;
  const image = data?.type === "TASK" ? data.task?.provider?.profilePicUrl : data?.performer?.profilePicUrl;
  return <>
    <SEO title={title || "Shared on OnIT"} description={description || "Discover work and talent on FirstDoer."} image={image} canonical={`https://www.firstdoer.com/s/${encodeURIComponent(code)}`} />
    {loading ? <main className="public-state"><div className="public-loading" /><p>Opening this OnIT link…</p></main> : <ShareContent data={data} code={code} />}
  </>;
}
