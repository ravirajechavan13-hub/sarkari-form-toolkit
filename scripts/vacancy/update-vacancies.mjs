import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SITE = "https://sarkari-form-toolkit-rho.vercel.app";
const OUT = "public/vacancy";
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];
const MAX_NEW = 8;
const SOURCES = [
  "https://ssc.gov.in/",
  "https://upsc.gov.in/",
  "https://www.ibps.in/",
  "https://www.rrbcdg.gov.in/",
  "https://www.indiapost.gov.in/",
];
const ALLOWED = [/\.gov\.in$/, /\.nic\.in$/, /(^|\.)ibps\.in$/];
const KEY = process.env.GEMINI_API_KEY;
const today = new Date().toISOString().slice(0, 10);
const cutoff = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);

const okHost = (u) => {
  try { return ALLOWED.some((r) => r.test(new URL(u).hostname)); } catch { return false; }
};
const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const str = (x) => (typeof x === "string" ? x.trim() : x == null ? "" : String(x).trim());

async function get(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SarkariToolkitBot/1.0)" },
    signal: AbortSignal.timeout(30000),
    redirect: "follow",
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
  if (!okHost(r.url)) throw new Error("non-official host");
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("pdf") || /\.pdf($|\?)/i.test(url)) {
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 15e6) throw new Error("pdf too big");
    return { pdf: buf.toString("base64") };
  }
  return { html: await r.text() };
}

function links(html, base) {
  const out = new Set();
  const re = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let u;
    try { u = new URL(m[1].trim(), base).href.split("#")[0]; } catch { continue; }
    const text = m[2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const all = text + " " + u;
    if (!/^https?:/.test(u) || !okHost(u)) continue;
    if (!/recruit|vacanc|notif|advert|exam|apply|bharti|posts/i.test(all)) continue;
    if (/result|admit|answer|syllabus|tender|mailto|javascript|\.(jpg|png|zip|doc)/i.test(all)) continue;
    out.add(u);
  }
  return [...out];
}

const toText = (html) =>
  html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 30000);

const PROMPT = (url) => `You read ONE official Indian government document (URL: ${url}). Today is ${today}.
Return ONLY a JSON object. Use only facts written in the document. Never guess; use null when missing.
If the document is not a job/vacancy recruitment notification, return {"is_recruitment": false}.
Keys: is_recruitment (true/false), title, organisation, total_posts, qualification, age_limit (min and max, with category relaxation if given), fee, start_date (YYYY-MM-DD), last_date (YYYY-MM-DD), exam_date (YYYY-MM-DD or text), how_to_apply (array of 4-6 short steps), documents (array), apply_link (official apply URL if written).`;

async function ask(parts) {
  let last = "fail";
  for (const model of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0, responseMimeType: "application/json" } }),
      signal: AbortSignal.timeout(90000),
    });
    if (!r.ok) { last = r.status === 429 ? "QUOTA" : "HTTP " + r.status; continue; }
    const j = await r.json();
    const t = (j?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    try { return JSON.parse(t.replace(/```json|```/g, "").trim()); } catch { return null; }
  }
  throw new Error(last);
}

function clean(d, url) {
  if (!d || d.is_recruitment !== true) return null;
  const arr = (a) => (Array.isArray(a) ? a.map(str).filter(Boolean).slice(0, 8) : []);
  const v = {
    title: str(d.title), organisation: str(d.organisation), total_posts: str(d.total_posts),
    qualification: str(d.qualification), age: str(d.age_limit), fee: str(d.fee),
    start_date: str(d.start_date), last_date: str(d.last_date), exam_date: str(d.exam_date),
    how_to_apply: arr(d.how_to_apply), documents: arr(d.documents),
  };
  if (!v.title || !v.organisation || !v.qualification || !v.age) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.last_date) || v.last_date < today) return null;
  v.source_url = url;
  v.apply_link = okHost(d.apply_link) ? d.apply_link : url;
  v.slug = (v.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "vacancy") +
    "-" + crypto.createHash("md5").update(url).digest("hex").slice(0, 6);
  v.created = today;
  return v;
}

const CSS = `body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f8fb;color:#1c2b3a;line-height:1.55}
.w{max-width:760px;margin:0 auto;padding:16px}
header{background:#203853;color:#fff;padding:14px 16px}
header a{color:#fff;text-decoration:none;font-weight:700}
h1{font-size:1.4rem;margin:.6rem 0}
.c{background:#fff;border:1px solid #dde4ec;border-radius:12px;padding:14px 16px;margin:12px 0}
.c h2{font-size:1rem;margin:0 0 6px;color:#203853}
.b{display:inline-block;background:#ee7a56;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;margin:4px 6px 4px 0}
.n{font-size:.9rem;color:#5a6b7c}
.x{background:#fff3ee;border:1px solid #f3c3b3;border-radius:10px;padding:10px 12px;font-size:.92rem}
.t{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:.9rem;color:#5a6b7c}
a.card{display:block;color:inherit;text-decoration:none}`;

const shell = (title, desc, body) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><style>${CSS}</style></head><body><header><a href="/">Sarkari Form ToolKit</a></header><div class="w">${body}</div></body></html>`;

const row = (k, v) => (v ? `<div class="c"><h2>${k}</h2><div>${esc(v)}</div></div>` : "");
const list = (k, a) => (a.length ? `<div class="c"><h2>${k}</h2><ol>${a.map((i) => `<li>${esc(i)}</li>`).join("")}</ol></div>` : "");

function detail(v) {
  const closed = v.last_date < today;
  return shell(`${v.title} | Sarkari Form ToolKit`, `${v.organisation} - ${v.title}: eligibility, age limit, fee and last date.`,
    `<p class="n"><a href="/vacancy/">&larr; All vacancies</a></p><h1>${esc(v.title)}</h1><p class="n">${esc(v.organisation)}</p>` +
    (closed ? `<div class="x"><b>Closed.</b> Is vacancy ki last date nikal chuki hai.</div>` : "") +
    row("Total posts", v.total_posts) + row("Eligibility (qualification)", v.qualification) +
    row("Age limit", v.age) + row("Fee", v.fee) + row("Form start date", v.start_date) +
    row("Last date", v.last_date) + row("Exam date", v.exam_date) +
    list("How to apply", v.how_to_apply) + list("Documents needed", v.documents) +
    `<div class="c"><a class="b" href="${esc(v.apply_link)}" rel="noopener">Official apply link</a><a class="b" href="${esc(v.source_url)}" rel="noopener">Official notification</a><a class="b" href="/">Photo, Sign &amp; PDF tools</a></div>` +
    `<div class="x">आवेदन करने से पहले आधिकारिक नोटिफिकेशन ज़रूर देखें। यह जानकारी AI से निकाली गई है, इसलिए गलती संभव है।</div><p class="n">Last updated: ${esc(v.created)}</p>`);
}

function indexPage(open) {
  const cards = open.map((v) => {
    const d = Math.ceil((new Date(v.last_date) - new Date(today)) / 864e5);
    return `<a class="c card" href="/vacancy/${v.slug}/"><h2>${esc(v.title)}</h2><div>${esc(v.organisation)}</div><div class="t"><span>Posts: ${esc(v.total_posts || "see notice")}</span><span>Last date: ${esc(v.last_date)} (${d} din baaki)</span></div></a>`;
  }).join("");
  return shell("Latest Sarkari Vacancy | Sarkari Form ToolKit", "Latest government vacancies with eligibility, age limit, fee and last date.",
    `<h1>Latest Vacancies</h1><p class="n">Sirf official sarkari websites se li gayi jankari.</p>${cards || `<div class="c">Abhi koi nayi vacancy nahi hai. Kal dobara dekhiye.</div>`}`);
}

// ---------- main ----------
fs.mkdirSync(OUT, { recursive: true });
let db = { seen: [], vacancies: [] };
try { db = JSON.parse(fs.readFileSync(path.join(OUT, "data.json"), "utf8")); } catch {}
const seen = new Set(db.seen || []);
let vacancies = (db.vacancies || []).filter((v) => v.last_date >= cutoff);

if (!KEY) {
  console.log("GEMINI_API_KEY missing - skipping discovery");
} else {
  const cands = new Set();
  for (const s of SOURCES) {
    try {
      const p = await get(s);
      if (p.html) for (const u of links(p.html, s)) if (!seen.has(u)) cands.add(u);
    } catch (e) { console.log("source failed:", s, e.message); }
  }
  console.log("new candidates:", cands.size);
  for (const url of [...cands].slice(0, MAX_NEW)) {
    try {
      const p = await get(url);
      const parts = [{ text: PROMPT(url) }];
      if (p.pdf) parts.push({ inlineData: { mimeType: "application/pdf", data: p.pdf } });
      else parts.push({ text: toText(p.html) });
      const d = await ask(parts);
      seen.add(url);
      const v = clean(d, url);
      if (v && !vacancies.some((x) => x.slug === v.slug)) { vacancies.push(v); console.log("added:", v.title); }
    } catch (e) {
      if (e.message === "QUOTA") { console.log("quota reached, stopping for today"); break; }
      console.log("skip:", url, e.message);
    }
  }
}

for (const f of fs.readdirSync(OUT)) {
  const p = path.join(OUT, f);
  if (fs.statSync(p).isDirectory()) fs.rmSync(p, { recursive: true, force: true });
}
for (const v of vacancies) {
  fs.mkdirSync(path.join(OUT, v.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, v.slug, "index.html"), detail(v));
}
const open = vacancies.filter((v) => v.last_date >= today).sort((a, b) => a.last_date.localeCompare(b.last_date));
fs.writeFileSync(path.join(OUT, "index.html"), indexPage(open));
const urls = ["/vacancy/", ...vacancies.map((v) => `/vacancy/${v.slug}/`)];
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${SITE}${u}</loc></url>`).join("")}</urlset>`);
fs.writeFileSync(path.join(OUT, "data.json"), JSON.stringify({ seen: [...seen].slice(-3000), vacancies }, null, 1));
console.log("done. open vacancies:", open.length);
