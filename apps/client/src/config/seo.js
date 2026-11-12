export const SITE_NAME = "FirstDoer";
export const SITE_URL = "https://www.firstdoer.com";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/logo.png`;

export const DEFAULT_DESCRIPTION =
  "FirstDoer connects businesses and individuals with verified local and digital performers for fast, reliable task execution across India.";

export function toCanonicalUrl(value = "/") {
  const rawValue = String(value || "/").trim();

  try {
    const url = new URL(rawValue, SITE_URL);
    url.protocol = "https:";
    url.hostname = "www.firstdoer.com";
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
    return "FirstDoer | India's On-Demand Execution Infrastructure";
  }

  return /firstdoer|onit india/i.test(cleanTitle)
    ? cleanTitle
    : `${cleanTitle} | ${SITE_NAME}`;
}
