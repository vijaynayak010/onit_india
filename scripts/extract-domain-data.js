const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
  path.join(__dirname, "../client/src/components/DomainDetail.jsx"),
  "utf8"
);

const names = [
  "businessSubDomains",
  "contentSubDomains",
  "techSubDomains",
  "academicSubDomains",
  "onGroundSubDomains",
];
const nextNames = [
  "contentSubDomains",
  "techSubDomains",
  "academicSubDomains",
  "onGroundSubDomains",
  "domainSubDomainMap",
];
const endMarkerPatterns = [
  "];\r\n\r\nconst ",
  "];\n\nconst ",
  "];\r\nconst ",
  "];\nconst ",
];

const blocks = [];
for (let i = 0; i < names.length; i++) {
  const name = names[i];
  const next = nextNames[i];
  const start = content.indexOf("const " + name + " = [");
  const endMarkers = endMarkerPatterns.map((p) => p + next);
  let endIdx = -1;
  for (const em of endMarkers) {
    endIdx = content.indexOf(em);
    if (endIdx !== -1) break;
  }
  if (endIdx === -1) {
    console.error(name, "end not found");
    process.exit(1);
  }
  blocks.push(content.slice(start, endIdx + 2));
}

const mapStart = content.indexOf("const domainSubDomainMap = {");
const mapEnd = content.indexOf("};", mapStart) + 2;
const mapBlock = content.slice(mapStart, mapEnd);

const out = `/**
 * Domain sub-domain data and helpers for SEO sub-domain pages.
 * Generated from DomainDetail.jsx – do not edit manually; run: node scripts/extract-domain-data.js
 */
${blocks.join("\n\n")}

${mapBlock}

export function slugifyItem(text) {
  return text
    .toLowerCase()
    .replace(/\\s*\\(\\s*/g, " ")
    .replace(/\\s*\\)\\s*/g, " ")
    .replace(/\\s*\\/\\s*/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\\s-]/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .replace(/\\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "task";
}

/** All items across all domains: { domainSlug, domainLabel, blockTitle, itemName, itemSlug } */
export function getAllDomainSubDomainItems() {
  const list = [];
  for (const [domainSlug, config] of Object.entries(domainSubDomainMap)) {
    for (const block of config.subDomains) {
      for (const itemName of block.items) {
        list.push({
          domainSlug,
          domainLabel: config.label,
          blockTitle: block.title,
          itemName,
          itemSlug: slugifyItem(itemName),
        });
      }
    }
  }
  return list;
}

/** Get one item by domain and item slug. Returns { domainLabel, blockTitle, itemName } or null */
export function getDomainSubDomainItem(domainSlug, itemSlug) {
  const config = domainSubDomainMap[domainSlug];
  if (!config) return null;
  for (const block of config.subDomains) {
    for (const itemName of block.items) {
      if (slugifyItem(itemName) === itemSlug) {
        return {
          domainLabel: config.label,
          blockTitle: block.title,
          itemName,
        };
      }
    }
  }
  return null;
}

export { domainSubDomainMap };
`;

fs.writeFileSync(
  path.join(__dirname, "../client/src/data/domainSubDomains.js"),
  out,
  "utf8"
);
console.log("Wrote client/src/data/domainSubDomains.js");
