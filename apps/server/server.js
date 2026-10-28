import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAIService from "./services/openaiService.js";
import TaskValidator from "./validators/taskValidator.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsRoot = path.join(__dirname, "uploads");
const candidateResumesRoot = path.join(uploadsRoot, "candidate-resumes");
const careerUploadsRoot = path.join(candidateResumesRoot, "careers");

const isVercelRuntime = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

const PRODUCTION_CORS_ORIGINS = [
  "https://onitindia.com",
  "https://www.onitindia.com",
  "https://onitindia-preview.vercel.app",
  "https://onitindia1-xi.vercel.app",
  "https://admin.onitindia.com",
];

const LOCAL_DEV_CORS_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function resolveCorsOrigins() {
  const fromEnv = String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const allowed = new Set([
    ...PRODUCTION_CORS_ORIGINS,
    ...fromEnv,
    ...(isVercelRuntime ? [] : LOCAL_DEV_CORS_ORIGINS),
  ]);

  return allowed;
}

function corsOriginCallback(origin, callback) {
  const allowed = resolveCorsOrigins();
  if (!origin || allowed.has(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`Origin ${origin} not allowed by CORS`));
}

if (!isVercelRuntime && !fs.existsSync(careerUploadsRoot)) {
  fs.mkdirSync(careerUploadsRoot, { recursive: true });
}

const allowedCareerExtensions = new Set(["pdf", "doc", "docx", "png", "jpg", "jpeg"]);

const hasS3Config = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_REGION &&
  process.env.S3_ACCESS_KEY &&
  process.env.S3_SECRET_KEY,
);

const s3Client = hasS3Config
  ? new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    })
  : null;

const extensionMimeMap = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

const buildCareerStorage = () => {
  if (hasS3Config || isVercelRuntime) {
    // In serverless runtimes prefer memory storage to avoid filesystem write issues.
    return multer.memoryStorage();
  }

  // Local disk fallback for development environments without S3 credentials.
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, careerUploadsRoot),
    filename: (_req, file, cb) => {
      const originalName = file.originalname || "resume";
      const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });
};

const careerUpload = multer({
  storage: buildCareerStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = (path.extname(file.originalname || "").replace(".", "").toLowerCase());
    if (!allowedCareerExtensions.has(ext)) {
      cb(new Error("Unsupported file type. Allowed: PDF, DOC, DOCX, PNG, JPG"));
      return;
    }
    cb(null, true);
  },
});

const uploadCareerResumeToS3 = async (file) => {
  if (!s3Client || !hasS3Config) {
    throw new Error("S3 is not configured for career uploads.");
  }

  const ext = (path.extname(file.originalname || "").replace(".", "").toLowerCase());
  const safeName = (file.originalname || "resume").replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `candidate-resumes/careers/${Date.now()}-${randomUUID()}-${safeName}`;
  const contentType = file.mimetype || extensionMimeMap[ext] || "application/octet-stream";

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: contentType,
    }),
  );

  const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  return { key, publicUrl };
};

// Trust the first proxy (Vercel) to accurately identify client IP for rate limiting
app.set("trust proxy", 1);

/* ----------------------------------------
    GLOBAL MIDDLEWARE
---------------------------------------- */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cookieParser());

// Add Permissions Policy
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Disable unused HTTP methods
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send('Method Not Allowed');
  }
  next();
});

app.use(cors({ origin: corsOriginCallback, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(uploadsRoot));

const webBuildIndex = path.resolve(__dirname, "../client/dist/index.html");
const publicApiBase = () => (process.env.ONIT_BACKEND_API_URL || "https://wcnwjjyw3er242onl66k4ljnei0xqykl.lambda-url.ap-south-1.on.aws").replace(/\/$/, "");
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

function injectMeta(html, selector, content) {
  const safe = escapeHtml(content);
  const expression = new RegExp(`(<meta\\s+${selector}\\s+content=["'])[^"']*(["']\\s*\\/?>)`, "i");
  if (expression.test(html)) return html.replace(expression, (_match, prefix, suffix) => `${prefix}${safe}${suffix}`);
  return html.replace("</head>", `<meta ${selector} content="${safe}" /></head>`);
}

function renderPublicShell({ kind, search = "", code = "", data, title, description, image, content }) {
  let html = fs.readFileSync(webBuildIndex, "utf8");
  html = injectMeta(html, 'property="og:title"', title);
  html = injectMeta(html, 'property="og:description"', description);
  html = injectMeta(html, 'property="og:image"', image || "https://www.onitindia.com/logo.png");
  html = injectMeta(html, 'property="og:url"', kind === "share" ? `https://www.onitindia.com/s/${encodeURIComponent(code)}` : "https://www.onitindia.com/verify-invoice");
  html = injectMeta(html, 'name="description"', description);
  if (kind === "invoice") html = injectMeta(html, 'name="robots"', "noindex, nofollow");
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  const payload = JSON.stringify({ kind, code, search, data }).replace(/</g, "\\u003c");
  const markup = `<div id="root">${content}</div><script>window.__ONIT_SSR__=${payload};</script>`;
  html = html.replace('<div id="root"></div>', markup);
  return html;
}

function renderShareBody(data, code) {
  if (!data || data.available === false) {
    return '<main class="public-state"><span class="public-eyebrow">ONIT INDIA</span><h1>This link is no longer available</h1><p>It may have expired or been turned off by the person who shared it.</p><a class="public-primary-button" href="https://www.onitindia.com/">Open in OnIT app ↗</a></main>';
  }
  const task = data.type === "TASK" ? data.task : null;
  const person = data.type === "PERFORMER" ? data.performer : null;
  const title = task?.title || person?.displayName || "Shared on OnIT";
  const eyebrow = task ? [task.category, task.subcategory, task.service].filter(Boolean).join(" · ") || "TASK" : [person?.profession, person?.domain].filter(Boolean).join(" · ") || "PERFORMER PROFILE";
  const description = task?.description || person?.bio || "Discover work and talent on OnIT India.";
  const facts = task
    ? [["Price", task.priceAmount != null ? `${task.currency || "INR"} ${task.priceAmount}` : ""], ["Budget range", [task.budgetMinAmount, task.budgetMaxAmount].filter((value) => value != null).map((value) => `${task.currency || "INR"} ${value}`).join(" – ")], ["Location", task.locationHint], ["Interested", task.interestCount != null ? `${task.interestCount} performers` : ""], ["Task status", task.status], ["Work mode", task.isRemote == null ? "" : task.isRemote ? "Remote" : "On site"], ["Published", task.publishedAt ? new Date(task.publishedAt).toLocaleDateString("en-IN") : ""], ["Due date", task.dueAt ? new Date(task.dueAt).toLocaleDateString("en-IN") : ""], ["Provider city", task.provider?.city], ["Provider rating", task.provider?.ratingAvg != null ? `★ ${task.provider.ratingAvg} (${task.provider.ratingCount || 0})` : ""]]
    : [["City", person?.city], ["Experience", person?.experienceLevel], ["Rating", person?.ratingAvg != null ? `★ ${person.ratingAvg} (${person.ratingCount || 0})` : ""], ["Completed tasks", person?.completedTasksCount], ["Languages", (person?.languages || []).join(", ")], ["Member since", person?.memberSince ? new Date(person.memberSince).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""]];
  const factsHtml = facts.filter(([, value]) => value != null && value !== "").map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const skills = (task?.skills || person?.skills || []).map((value) => `<span class="public-chip">${escapeHtml(value)}</span>`).join("");
  const image = task?.provider?.profilePicUrl || person?.profilePicUrl;
  const name = task?.provider?.name || person?.displayName;
  const status = task ? `<div class="public-task-status"><span class="${task.isOpen ? "public-dot" : "public-dot public-dot-muted"}"></span>${task.isOpen ? "Accepting performers" : "This task is no longer accepting performers"}</div>` : "";
  const trust = person?.isKycVerified ? '<span class="public-verified">✓ Verified</span>' : "";
  const sharedBy = data.sharedBy?.name ? ` · shared by ${escapeHtml(data.sharedBy.name)}` : "";
  const providerMeta = task?.provider ? [task.provider.city, task.provider.ratingAvg != null ? `★ ${task.provider.ratingAvg} (${task.provider.ratingCount || 0})` : ""].filter(Boolean).map(escapeHtml).join(" · ") : "";
  const portfolio = (person?.portfolio || []).map((item) => {
    const url = typeof item === "string" ? item : item.url || item.imageUrl;
    return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title || "View work")} ↗</a>` : "";
  }).join("");
  const reviews = (person?.recentReviews || []).slice(0, 3).map((review) => `<blockquote class="public-review"><div>★ ${escapeHtml(review.rating ?? review.ratingAvg ?? "")}</div><p>${escapeHtml(review.comment || review.review || review.text || "")}</p><small>${escapeHtml(review.reviewerName || review.name || "OnIT member")}</small></blockquote>`).join("");
  const profileSections = portfolio || reviews ? `<section class="public-section">${portfolio ? `<h2>Portfolio</h2><div class="public-portfolio">${portfolio}</div>` : ""}${reviews ? `<h2>Recent reviews</h2>${reviews}` : ""}</section>` : "";
  return `<main class="public-page"><header class="public-brand"><a href="/"><span class="public-brand-mark">O</span> ONIT INDIA</a><span>${task ? `Task shared${sharedBy}` : "Performer profile"}</span></header><article class="public-card"><div class="public-eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1>${trust}${status}<p class="public-description">${escapeHtml(description)}</p><div class="public-facts">${factsHtml}</div><div class="public-chip-list">${skills}</div>${name ? `<section class="public-person">${image ? `<img src="${escapeHtml(image)}" alt="" />` : '<span class="public-avatar">O</span>'}<div><span>${task ? "Posted by" : "On OnIT"}</span><strong>${escapeHtml(name)}</strong><small>${providerMeta}</small></div></section>` : ""}${profileSections}<div class="public-app-actions"><a class="public-primary-button" href="https://www.onitindia.com/s/${encodeURIComponent(code)}">Open in OnIT app ↗</a><div class="public-store-links"><a href="https://play.google.com/store/apps/details?id=${task ? "com.onitapp.india" : "com.onitconsumer.india"}">Google Play</a><a href="https://apps.apple.com/in/search?term=onit%20india">App Store</a></div></div></article></main>`;
}

function renderInvoiceBody(payload) {
  const query = payload?.query || {};
  if (!Object.keys(query).length) return '<main class="invoice-page"><a class="invoice-brand" href="/">ONIT INDIA</a><section class="invoice-panel"><span class="public-eyebrow">DOCUMENT CHECK</span><h1>Verify an OnIT invoice</h1><p class="invoice-lede">Enter the invoice number and amount paid as shown on the document.</p><form class="invoice-form" action="/verify-invoice" method="get"><label>Invoice number<input name="invoiceNumber" required placeholder="INV-…" /></label><label>Amount paid<input name="amount" type="number" min="0" step="0.01" required placeholder="1500.00" /></label><button class="public-primary-button">Verify invoice →</button></form></section></main>';
  const verification = payload?.result || {};
  const result = verification.result || "NOT_FOUND";
  const labels = { VERIFIED: ["verified", "✓ Verified OnIT Invoice"], VOID: ["void", "Cancelled invoice – no longer valid"], NOT_FOUND: ["invalid", "Not verified – this document may not be genuine"], AMOUNT_MISMATCH: ["invalid", "Not verified – this document may not be genuine"], INVALID_SIGNATURE: ["invalid", "Not verified – this document may not be genuine"], NOT_ISSUED: ["pending", "Task not completed yet, no invoice issued"] };
  const [status, heading] = labels[result] || labels.NOT_FOUND;
  const invoice = verification.invoice;
  const details = invoice && ["VERIFIED", "VOID"].includes(result)
    ? Object.entries({ "Invoice number": invoice.invoiceNumber, Status: invoice.status, "Issued at": invoice.issuedAt && new Date(invoice.issuedAt).toLocaleString("en-IN"), "Voided at": invoice.voidedAt && new Date(invoice.voidedAt).toLocaleString("en-IN"), Task: invoice.taskTitle, Category: [invoice.category, invoice.subcategory].filter(Boolean).join(" · "), "Billed to": invoice.billedTo, "Performed by": invoice.performedBy, Currency: invoice.currency, "Base amount": invoice.baseAmount, "Platform fee": invoice.platformFee, "Commission fee": invoice.commissionFee, Discount: invoice.discountAmount, "Total paid": invoice.totalPaid, "Verification code": invoice.verificationCode, "Signature fingerprint": invoice.signatureFingerprint }).filter(([, value]) => value != null && value !== "").map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")
    : "";
  const download = result === "VERIFIED" && invoice?.pdfUrl ? `<a class="public-primary-button invoice-download" href="${escapeHtml(publicApiBase() + invoice.pdfUrl)}">Download official PDF ↗</a>` : "";
  return `<main class="invoice-page"><a class="invoice-brand" href="/">ONIT INDIA</a><section class="invoice-panel"><span class="public-eyebrow">DOCUMENT CHECK</span><div class="invoice-result"><span class="invoice-result-mark ${status}">${status === "verified" ? "✓" : "!"}</span><h1>${escapeHtml(heading)}</h1><p class="invoice-message">${escapeHtml(verification.message || "")}</p>${details ? `<dl class="invoice-fields">${details}</dl>` : ""}${download}</div><a class="invoice-another" href="/verify-invoice">Check another invoice</a></section></main>`;
}

async function handleSharePage(code, res) {
  try {
    const response = await fetch(`${publicApiBase()}/public/share/${encodeURIComponent(code)}`, { cache: "no-store" });
    const data = response.status === 404 ? { available: false } : await response.json();
    const title = data?.type === "TASK" ? data.task?.title : data?.performer?.displayName;
    const description = data?.type === "TASK" ? data.task?.description : data?.performer?.bio;
    const image = data?.type === "TASK" ? data.task?.provider?.profilePicUrl : data?.performer?.profilePicUrl;
    res.set("Cache-Control", "no-store, max-age=0").status(200).send(renderPublicShell({
      kind: "share", code, data, title: title || "Shared on OnIT", description: description || "Discover work and talent on OnIT India.", image,
      content: renderShareBody(data, code),
    }));
  } catch (error) {
    console.error("SSR share page error:", error);
    res.status(502).send("Unable to open this OnIT link right now.");
  }
}

// Vercel proxies the original URL to Express, so handle both the direct path
// and the rewritten /api/share-page path (used internally via vercel.json rewrite).
app.get("/s/:code", (req, res) => handleSharePage(String(req.params.code || ""), res));
app.get("/api/share-page", (req, res) => handleSharePage(String(req.query.code || ""), res));

app.get("/api/invoice-page", async (req, res) => {
  const original = req.originalUrl || req.url || "";
  const rawQuery = original.includes("?") ? original.slice(original.indexOf("?")) : "";
  const payload = { query: Object.fromEntries(new URLSearchParams(rawQuery)) };
  try {
    if (rawQuery) {
      const response = await fetch(`${publicApiBase()}/public/invoices/verify${rawQuery}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      payload.result = await response.json();
      if (!response.ok) throw new Error(payload.result?.message || "Invoice verification unavailable");
    }
    res.set("Cache-Control", "no-store, max-age=0").send(renderPublicShell({
      kind: "invoice", search: rawQuery, data: payload.result || null, title: "OnIT Invoice Verification",
      description: "Verify the authenticity of an OnIT invoice.", content: renderInvoiceBody(payload),
    }));
  } catch (error) {
    console.error("SSR invoice page error:", error);
    res.status(502).send("Invoice verification is temporarily unavailable.");
  }
});

app.get("/api/app-links/apple", (_req, res) => {
  const teamId = String(process.env.ONIT_APPLE_TEAM_ID || "").trim();
  const bundleIds = String(process.env.ONIT_APPLE_BUNDLE_IDS || "").split(",").map((value) => value.trim()).filter(Boolean);
  const details = teamId ? bundleIds.map((bundleId) => ({
    appID: `${teamId}.${bundleId}`,
    paths: ["/s/*", "/verify-invoice*"],
  })) : [];
  res.set("Cache-Control", "no-store, max-age=0").type("application/json").json({ applinks: { apps: [], details } });
});

/* ----------------------------------------
    RATE LIMITING
---------------------------------------- */
const aiTaskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    error: "Too many requests. Please wait a moment and try again.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ----------------------------------------
    AI TASK GENERATION ENDPOINT
---------------------------------------- */
app.post("/api/ai-task", aiTaskLimiter, async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt exists
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt: must be a non-empty string",
        code: "INVALID_PROMPT",
        timestamp: new Date().toISOString()
      });
    }

    // Sanitize and validate prompt length
    const sanitizedPrompt = TaskValidator.sanitizePrompt(prompt);

    if (sanitizedPrompt.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt: must be between 1 and 2000 characters",
        code: "INVALID_PROMPT",
        timestamp: new Date().toISOString()
      });
    }

    if (sanitizedPrompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt: must be between 1 and 2000 characters",
        code: "INVALID_PROMPT",
        timestamp: new Date().toISOString()
      });
    }

    // Initialize OpenAI service
    const openaiService = new OpenAIService();

    // Generate task
    const generatedTask = await openaiService.generateTask(sanitizedPrompt);

    // Validate generated task
    const validation = TaskValidator.validate(generatedTask);

    if (!validation.isValid) {
      console.error('Task validation failed:', validation.errors);
      return res.status(500).json({
        success: false,
        error: "AI service returned invalid data. Please try again.",
        code: "INVALID_RESPONSE",
        timestamp: new Date().toISOString()
      });
    }

    // Return successful response
    res.json({
      success: true,
      data: validation.sanitizedData
    });

  } catch (error) {
    console.error("AI Task Generation Error:", error);

    // Determine error type and return appropriate response
    let errorMessage = "Could not generate task. Please try again.";
    let errorCode = "AI_SERVICE_ERROR";
    let statusCode = 500;

    if (error.message.includes('authentication') || error.message.includes('API key')) {
      errorMessage = "AI service unavailable. Please try again later.";
      errorCode = "AI_SERVICE_ERROR";
    } else if (error.message.includes('rate limit')) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
      errorCode = "RATE_LIMIT_EXCEEDED";
      statusCode = 429;
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      errorMessage = "Connection failed. Check your internet connection.";
      errorCode = "NETWORK_ERROR";
    } else if (error.message.includes('timeout')) {
      errorMessage = "Request timeout. Please try again.";
      errorCode = "TIMEOUT";
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString()
    });
  }
});

/* ----------------------------------------
    ENHANCE DESCRIPTION ENDPOINT
---------------------------------------- */
app.post("/api/enhance-description", aiTaskLimiter, async (req, res) => {
  try {
    const { description, productType } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Invalid description",
        code: "INVALID_INPUT"
      });
    }

    const openaiService = new OpenAIService();
    const enhanced = await openaiService.enhanceDescription(description, productType);

    res.json({
      success: true,
      enhanced: enhanced
    });

  } catch (error) {
    console.error("Enhance Description Error:", error);
    res.status(500).json({
      success: false,
      error: "Could not enhance description. Please try again.",
      code: "AI_SERVICE_ERROR"
    });
  }
});

/* ----------------------------------------
    SUBMIT TASK TO GOOGLE SHEET
---------------------------------------- */
app.post("/api/submit-task", async (req, res) => {
  try {
    const { taskDetails, name, email, mobileNumber } = req.body;
    // Use environment variable or fallback to hardcoded URL
    const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbznoZ8KMA1aqEq4ULdY91N7oKWFN9_i4FJRe0DhvNhabUpXpzBEBkpRf0YE7wFPQc0P9w/exec";

    console.log("Submitting to Google Apps Script:", googleAppsScriptUrl);
    console.log("Task Details:", taskDetails);
    console.log("Name:", name, "Email:", email, "Mobile:", mobileNumber);

    const response = await fetch(googleAppsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        taskDetails: taskDetails || "",
        name: name || "",
        email: email || "",
        mobileNumber: mobileNumber || "",
      }),
    });

    const result = await response.text();
    console.log("Google Apps Script response:", result);

    // Return success
    res.json({ message: "Task submitted successfully! Our team will connect with you within 2 min." });
  } catch (err) {
    console.error("Submit task error:", err);
    res.status(500).json({ error: "Failed to submit task: " + err.message });
  }
});

/* ----------------------------------------
    SUBMIT CAREER APPLICATION TO GOOGLE SHEET
---------------------------------------- */
app.post("/api/submit-career", careerUpload.single("portfolio"), async (req, res) => {
  try {
    const { name, email, phone, role, jobId, jobTitle, coverNote } = req.body;
    const backendApiUrl = (process.env.ONIT_BACKEND_API_URL || "https://wcnwjjyw3er242onl66k4ljnei0xqykl.lambda-url.ap-south-1.on.aws").replace(/\/$/, "");
    const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbznoZ8KMA1aqEq4ULdY91N7oKWFN9_i4FJRe0DhvNhabUpXpzBEBkpRf0YE7wFPQc0P9w/exec";

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Portfolio/Resume file is required." });
    }

    if (!hasS3Config && isVercelRuntime) {
      return res.status(400).json({
        error:
          "Resume storage is not configured. Set S3_BUCKET, S3_REGION, S3_ACCESS_KEY, and S3_SECRET_KEY in deployment environment.",
      });
    }

    const portfolioFileName = req.file.originalname || req.file.filename || "resume";
    let portfolioFileUrl = "";

    if (hasS3Config) {
      const uploaded = await uploadCareerResumeToS3(req.file);
      portfolioFileUrl = uploaded.publicUrl;
    } else {
      const publicBase = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
      portfolioFileUrl = `${publicBase.replace(/\/$/, "")}/uploads/candidate-resumes/careers/${req.file.filename}`;
    }
    const normalizedJobId = typeof jobId === "string" ? jobId.trim() : "";
    const normalizedJobTitle = (typeof jobTitle === "string" ? jobTitle.trim() : "") ||
      (typeof role === "string" ? role.trim() : "");

    // 1) Persist to backend DB so admin portal can list all applications.
    const backendResponse = await fetch(`${backendApiUrl}/careers/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        ...(normalizedJobId ? { jobId: normalizedJobId } : {}),
        ...(normalizedJobTitle ? { jobTitle: normalizedJobTitle } : {}),
        coverNote,
        portfolioFileName,
        portfolioFileUrl,
        source: "website",
      }),
    });

    if (!backendResponse.ok) {
      let backendError = "Failed to save application to backend.";
      try {
        const parsed = await backendResponse.json();
        backendError = parsed?.message || parsed?.error || backendError;
      } catch {
        // ignore parse errors and use default message
      }
      const status = backendResponse.status >= 400 ? backendResponse.status : 500;
      return res.status(status).json({ error: backendError });
    }

    // 2) Keep writing to sheet as a secondary copy (non-blocking if it fails).
    const params = new URLSearchParams({
      formType: "career",
      name: name || "",
      email: email || "",
      phone: phone || "",
      role: normalizedJobTitle || "",
      coverNote: coverNote || "",
      portfolioFileName: portfolioFileName || "",
      portfolioFileUrl: portfolioFileUrl || "",
    });

    const response = await fetch(googleAppsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const result = await response.text();
    console.log("Career submission response:", result);

    let data;
    try {
      data = JSON.parse(result);
    } catch {
      data = { success: false, error: result || "Unknown response" };
    }
    if (!data.success) {
      console.error("Google Apps Script error:", data.error);
    }

    res.json({
      message: "Application submitted successfully.",
      portfolioFileUrl,
      portfolioFileName,
      storage: hasS3Config ? "s3" : "local",
    });
  } catch (err) {
    console.error("Submit career error:", err);
    res.status(500).json({ error: "Failed to save application: " + err.message });
  }
});

app.use((err, _req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File size must be 10MB or less." });
      return;
    }
    res.status(400).json({ error: err.message || "File upload failed." });
    return;
  }

  if (err.message?.includes("Unsupported file type")) {
    res.status(400).json({ error: err.message });
    return;
  }

  next(err);
});

/* ----------------------------------------
    START SERVER
---------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

export default app;
