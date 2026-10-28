export const SITE_NAME = "OnIT INDIA";
export const SITE_URL = "https://www.onitindia.com";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/logo.png`;

export const DEFAULT_DESCRIPTION =
  "OnIT INDIA connects people and businesses with verified performers for freelance, digital, and local tasks across India.";

export function toCanonicalUrl(value = "/") {
  const rawValue = String(value || "/").trim();

  try {
    const url = new URL(rawValue, SITE_URL);
    url.protocol = "https:";
    url.hostname = "www.onitindia.com";
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname !== "/" ? url.pathname.replace(/\/+$/, "") : "/";
    return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
  } catch {
    return SITE_URL;
  }
}
export function withBrand(title) {
  const cleanTitle = String(title || "").trim();
  if (!cleanTitle) {
    return "OnIT INDIA | Freelance & Task Marketplace in India";
  }

  return /onit india/i.test(cleanTitle)
    ? cleanTitle
    : `${cleanTitle} | ${SITE_NAME}`;
}
