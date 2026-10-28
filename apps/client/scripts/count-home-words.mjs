import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "..", "src");

const files = [
  "components/ScrollingInfo.jsx",
  "components/Navbar.jsx",
  "components/Landingpage.jsx",
  "components/task_seeker.jsx",
  "components/FindTaskerNearby.jsx",
  "components/Team.jsx",
  "components/Partner.jsx",
  "components/Domains.jsx",
  "components/HowItWorks.jsx",
  "components/WhyChooseUs.jsx",
  "components/Testimonials.jsx",
  "components/Footer.jsx",
];

let raw = "";
for (const f of files) {
  raw += fs.readFileSync(path.join(src, f), "utf8") + "\n";
}

const app = fs.readFileSync(path.join(src, "App.jsx"), "utf8");
const vs = app.indexOf("function VideoSection");
const vsEnd = app.indexOf("function Home", vs);
raw += app.slice(vs, vsEnd);

function stripJsxLike(s) {
  s = s.replace(/\/\*[\s\S]*?\*\//g, " ");
  s = s.replace(/\/\/[^\n]*/g, " ");
  s = s.replace(/^import\s[^;]+;/gm, " ");
  s = s.replace(/<[A-Za-z/][^>]{0,8000}?>/g, " ");
  let prev;
  do {
    prev = s;
    s = s.replace(/\{[^{}]{0,12000}\}/g, " ");
  } while (s !== prev);
  return s;
}

const stripped = stripJsxLike(raw);
const words = stripped.match(/[A-Za-z][A-Za-z0-9'-]*/g) || [];
const codeish = new Set([
  "className",
  "const",
  "return",
  "function",
  "export",
  "default",
  "true",
  "false",
  "null",
  "undefined",
  "div",
  "span",
  "button",
  "Link",
  "motion",
  "useState",
  "useEffect",
  "import",
  "from",
]);
const filtered = words.filter((w) => !codeish.has(w) && w.length > 1);

console.log(`Source files: ${files.length} + VideoSection from App.jsx (home route "/" only)`);
console.log(`Rough token count (alphanumeric after stripping tags): ${words.length}`);
console.log(`Heuristic filtered (code-ish removed): ${filtered.length}`);
console.log(`Unique words (lower): ${new Set(filtered.map((x) => x.toLowerCase())).size}`);
console.log("");
console.log(
  "Note: Approximate — strips JSX tags and {...}; may include some leftover identifiers.",
);
