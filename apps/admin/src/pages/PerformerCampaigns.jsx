import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Pause, Play, Plus, RefreshCw } from 'lucide-react';
import {
  activateRecommendationCampaign,
  approveRecommendationCampaign,
  createRecommendationAdvertiser,
  createRecommendationCampaign,
  getRecommendationCampaignAnalytics,
  listRecommendationAdvertisers,
  listRecommendationCampaigns,
  pauseRecommendationCampaign,
} from '../services/api';

const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500';
const button = 'inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50';
const secondary = 'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50';
const emptyCampaign = { name: '', title: '', description: '', creativeUrl: '', destinationUrl: '', category: '', advertiserId: '', isSponsored: false, priority: 0, accessStatus: '', impressionLimit: '', clickLimit: '' };

export default function PerformerCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [draft, setDraft] = useState(emptyCampaign);
  const [brand, setBrand] = useState({ legalName: '', brandName: '', contactEmail: '' });
  const [analytics, setAnalytics] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    const [campaignRows, advertiserRows] = await Promise.all([listRecommendationCampaigns(), listRecommendationAdvertisers()]);
    setCampaigns(Array.isArray(campaignRows) ? campaignRows : []);
    setAdvertisers(Array.isArray(advertiserRows) ? advertiserRows : []);
  }, []);
  useEffect(() => { refresh().catch((cause) => setError(cause.message || 'Unable to load campaigns')); }, [refresh]);

  const act = async (work, success) => {
    setBusy(true); setError(''); setNotice('');
    try { await work(); await refresh(); setNotice(success); }
    catch (cause) { setError(cause.response?.data?.message || cause.message || 'Action failed'); }
    finally { setBusy(false); }
  };

  const createBrand = (event) => {
    event.preventDefault();
    act(async () => { await createRecommendationAdvertiser(brand); setBrand({ legalName: '', brandName: '', contactEmail: '' }); }, 'Advertiser added.');
  };
  const createCampaign = (event) => {
    event.preventDefault();
    act(async () => {
      await createRecommendationCampaign({
        name: draft.name.trim(), title: draft.title.trim(), description: draft.description.trim(),
        creativeUrl: draft.creativeUrl.trim(), destinationUrl: draft.destinationUrl.trim(), category: draft.category.trim(),
        advertiserId: draft.advertiserId || undefined, isSponsored: Boolean(draft.advertiserId),
        priority: Number(draft.priority) || 0,
        audienceRulesJson: draft.accessStatus ? { categories: [draft.category.trim()], accessStatuses: [draft.accessStatus] } : { categories: [draft.category.trim()] },
        impressionLimit: draft.impressionLimit ? Number(draft.impressionLimit) : undefined,
        clickLimit: draft.clickLimit ? Number(draft.clickLimit) : undefined,
        disclosureText: draft.advertiserId ? 'Sponsored' : 'OnIT Resource',
      });
      setDraft(emptyCampaign);
    }, 'Campaign saved as a draft. Approve it to start delivery.');
  };

  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">Recommendations</h2><p className="mt-1 text-sm text-slate-500">Manage useful resources and clearly labeled sponsored cards. Cards never affect task eligibility.</p></div><button type="button" className={secondary} disabled={busy} onClick={() => act(refresh, 'Updated.')}><RefreshCw size={15} /> Refresh</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-3">{campaigns.map((campaign) => <article key={campaign.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{campaign.category} · {campaign.isSponsored ? 'Sponsored' : 'OnIT resource'}</p><h3 className="mt-1 font-black text-slate-900">{campaign.title}</h3><p className="mt-1 text-sm text-slate-600">{campaign.description}</p><p className="mt-2 text-xs text-slate-500">{campaign.advertiser?.brandName || campaign.name} · Priority {campaign.priority} · {campaign.status}</p></div><div className="flex flex-wrap gap-2">{['DRAFT', 'REJECTED'].includes(campaign.status) && <button type="button" disabled={busy} className={secondary} onClick={() => act(() => approveRecommendationCampaign(campaign.id), 'Campaign approved.')}><CheckCircle2 size={15} /> Approve</button>}{['ACTIVE', 'SCHEDULED'].includes(campaign.status) && <button type="button" disabled={busy} className={secondary} onClick={() => act(() => pauseRecommendationCampaign(campaign.id), 'Campaign paused.')}><Pause size={15} /> Pause</button>}{campaign.status === 'PAUSED' && <button type="button" disabled={busy} className={secondary} onClick={() => act(() => activateRecommendationCampaign(campaign.id), 'Campaign reactivated.')}><Play size={15} /> Activate</button>}</div></div><button type="button" className="mt-3 text-xs font-bold text-emerald-700" onClick={async () => { try { const data = await getRecommendationCampaignAnalytics(campaign.id); setAnalytics((old) => ({ ...old, [campaign.id]: data })); } catch (cause) { setError(cause.message || 'Analytics unavailable'); } }}>View analytics</button>{analytics[campaign.id] && <p className="mt-2 text-sm text-slate-600">{analytics[campaign.id].total_impressions} views · {analytics[campaign.id].total_clicks} clicks · {analytics[campaign.id].ctr}% CTR · {analytics[campaign.id].unique_performers_reached} performers reached</p>}</article>)}{campaigns.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">No campaigns yet. Create an OnIT resource or partner campaign.</p>}</div>
      <div className="space-y-5"><form onSubmit={createCampaign} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">Create recommendation</h3><input required className={field} placeholder="Internal campaign name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><input required className={field} placeholder="Card title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /><textarea required className={field} placeholder="Helpful description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /><input required className={field} placeholder="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /><input required type="url" className={field} placeholder="Image URL" value={draft.creativeUrl} onChange={(event) => setDraft({ ...draft, creativeUrl: event.target.value })} /><input required type="url" className={field} placeholder="Destination URL" value={draft.destinationUrl} onChange={(event) => setDraft({ ...draft, destinationUrl: event.target.value })} /><select className={field} value={draft.advertiserId} onChange={(event) => setDraft({ ...draft, advertiserId: event.target.value })}><option value="">OnIT-owned (not sponsored)</option>{advertisers.filter((item) => item.status === 'ACTIVE').map((item) => <option key={item.id} value={item.id}>{item.brandName} (sponsored)</option>)}</select><select className={field} value={draft.accessStatus} onChange={(event) => setDraft({ ...draft, accessStatus: event.target.value })}><option value="">Any category access status</option>{['APPROVED', 'PENDING_REVIEW', 'WAITLISTED', 'REJECTED'].map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select><div className="grid grid-cols-3 gap-2"><input type="number" className={field} placeholder="Priority" aria-label="Priority" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })} /><input type="number" min="1" className={field} placeholder="View cap" aria-label="Impression limit" value={draft.impressionLimit} onChange={(event) => setDraft({ ...draft, impressionLimit: event.target.value })} /><input type="number" min="1" className={field} placeholder="Click cap" aria-label="Click limit" value={draft.clickLimit} onChange={(event) => setDraft({ ...draft, clickLimit: event.target.value })} /></div><button disabled={busy} className={button}><Plus size={15} /> Save draft</button></form><form onSubmit={createBrand} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">Add partner brand</h3><input required className={field} placeholder="Legal name" value={brand.legalName} onChange={(event) => setBrand({ ...brand, legalName: event.target.value })} /><input required className={field} placeholder="Brand name" value={brand.brandName} onChange={(event) => setBrand({ ...brand, brandName: event.target.value })} /><input type="email" className={field} placeholder="Contact email" value={brand.contactEmail} onChange={(event) => setBrand({ ...brand, contactEmail: event.target.value })} /><button disabled={busy} className={secondary}><Plus size={15} /> Add advertiser</button></form></div>
    </div>
  </div>;
}
