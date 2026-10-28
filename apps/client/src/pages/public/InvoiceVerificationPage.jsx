import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApiUrl } from "../../config/apiBase";
import SEO from "../../components/seo/SEO";
import "./publicPages.css";

function initialInvoice(search) {
  if (typeof window === "undefined") return null;
  const payload = window.__ONIT_SSR__;
  return payload?.kind === "invoice" && payload.search === search ? payload.data : null;
}

function amount(value, currency) {
  if (value == null || value === "") return "—";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR", maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency || "INR"} ${value}`;
  }
}

function InvoiceFields({ invoice }) {
  const fields = [
    ["Invoice number", invoice.invoiceNumber],
    ["Status", invoice.status],
    ["Issued", invoice.issuedAt && new Date(invoice.issuedAt).toLocaleString("en-IN")],
    ["Task", invoice.taskTitle],
    ["Category", [invoice.category, invoice.subcategory].filter(Boolean).join(" · ")],
    ["Billed to", invoice.billedTo],
    ["Performed by", invoice.performedBy],
    ["Base amount", amount(invoice.baseAmount, invoice.currency)],
    ["Platform fee", amount(invoice.platformFee, invoice.currency)],
    ["Commission fee", amount(invoice.commissionFee, invoice.currency)],
    ["Discount", amount(invoice.discountAmount, invoice.currency)],
    ["Total paid", amount(invoice.totalPaid, invoice.currency)],
    ["Verification code", invoice.verificationCode],
    ["Signature fingerprint", invoice.signatureFingerprint],
    ...(invoice.voidedAt ? [["Voided", new Date(invoice.voidedAt).toLocaleString("en-IN")]] : []),
  ].filter(([, value]) => value != null && value !== "");
  return <dl className="invoice-fields">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

const RESULT_COPY = {
  VERIFIED: { className: "verified", heading: "✓ Verified OnIT Invoice" },
  VOID: { className: "void", heading: "Cancelled invoice – no longer valid" },
  NOT_FOUND: { className: "invalid", heading: "Not verified – this document may not be genuine" },
  AMOUNT_MISMATCH: { className: "invalid", heading: "Not verified – this document may not be genuine" },
  INVALID_SIGNATURE: { className: "invalid", heading: "Not verified – this document may not be genuine" },
  NOT_ISSUED: { className: "pending", heading: "Task not completed yet, no invoice issued" },
};

function ResultContent({ payload, loading, error }) {
  if (loading) return <div className="invoice-state"><div className="public-loading" /><p>Checking invoice…</p></div>;
  if (error) return <div className="invoice-state"><span className="invoice-result-mark invalid">!</span><h1>Unable to verify this invoice</h1><p>{error}</p></div>;
  const view = RESULT_COPY[payload?.result] || RESULT_COPY.NOT_FOUND;
  const invoice = payload?.invoice;
  return <div className="invoice-result">
    <span className={`invoice-result-mark ${view.className}`}>{payload?.result === "VERIFIED" ? "✓" : payload?.result === "VOID" ? "!" : "•"}</span>
    <h1>{view.heading}</h1>
    <p className="invoice-message">{payload?.message || " "}</p>
    {invoice && (payload.result === "VERIFIED" || payload.result === "VOID") && <>
      <InvoiceFields invoice={invoice} />
      {payload.result === "VERIFIED" && invoice.pdfUrl && <a className="public-primary-button invoice-download" href={getApiUrl(invoice.pdfUrl)} target="_blank" rel="noreferrer">Download official PDF ↗</a>}
    </>}
    {payload?.checkedAt && <p className="invoice-checked">Checked {new Date(payload.checkedAt).toLocaleString("en-IN")}</p>}
  </div>;
}

export default function InvoiceVerificationPage() {
  const location = useLocation();
  const search = location.search;
  const hasQuery = search.length > 1;
  const [payload, setPayload] = useState(() => initialInvoice(search));
  const [loading, setLoading] = useState(hasQuery && !initialInvoice(search));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasQuery || payload) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    fetch(getApiUrl(`/public/invoices/verify${search}`), { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "The verification service is unavailable.");
        return result;
      })
      .then((result) => { if (active) setPayload(result); })
      .catch((cause) => { if (active) setError(cause.message || "The verification service is unavailable."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [hasQuery, payload, search]);

  if (!hasQuery) {
    return <>
      <SEO title="Verify an OnIT Invoice" description="Check the authenticity of an OnIT invoice." noindex />
      <main className="invoice-page">
        <a className="invoice-brand" href="/">ONIT INDIA</a>
        <section className="invoice-panel">
          <span className="public-eyebrow">DOCUMENT CHECK</span>
          <h1>Verify an OnIT invoice</h1>
          <p className="invoice-lede">Enter the invoice number and amount paid as shown on the document.</p>
          <form className="invoice-form" action="/verify-invoice" method="get">
            <label>Invoice number<input name="invoiceNumber" required placeholder="INV-…" autoComplete="off" /></label>
            <label>Amount paid<input name="amount" type="number" min="0" step="0.01" required placeholder="1500.00" inputMode="decimal" /></label>
            <button className="public-primary-button" type="submit">Verify invoice <span aria-hidden="true">→</span></button>
          </form>
          <p className="invoice-footnote">Verification checks the invoice against OnIT’s official records.</p>
        </section>
      </main>
    </>;
  }

  return <>
    <SEO title="OnIT Invoice Verification" description="Verify the authenticity of an OnIT invoice." noindex />
    <main className="invoice-page">
      <a className="invoice-brand" href="/">ONIT INDIA</a>
      <section className="invoice-panel"><span className="public-eyebrow">DOCUMENT CHECK</span><ResultContent payload={payload} loading={loading} error={error} />
        <a className="invoice-another" href="/verify-invoice">Check another invoice</a>
      </section>
    </main>
  </>;
}
