import { readFile, writeFile, mkdir } from "node:fs/promises";
import { xml } from "./lib.mjs";
const root = new URL("../", import.meta.url);
const load = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const profile = await load("data/profile.json");
const data = await load("data/github.json");
const C = {
  bg: "#15271F",
  panel: "#1E3528",
  border: "#405C3B",
  lime: "#C7F464",
  text: "#F0F4E7",
  muted: "#A9BE9A",
  soft: "#8BAC73",
};
const number = (value) => Number(value || 0).toLocaleString("en-US");
const text = (x, y, value, size = 16, color = C.text, extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${xml(value)}</text>`;
const rect = (x, y, w, h, fill = C.panel, rx = 12, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const line = (x, y, x2, y2) =>
  `<path d="M${x} ${y}L${x2} ${y2}" stroke="${C.border}" fill="none"/>`;
function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${xml(title)}</title><style>text{font-family:Arial,Helvetica,sans-serif}.mono{font-family:monospace;letter-spacing:1px}.pulse{animation:pulse 3s ease-in-out infinite}.flow{stroke-dasharray:8 12;animation:flow 4s linear infinite}.reveal{animation:reveal 1.2s ease-out both}@keyframes pulse{50%{opacity:.35}}@keyframes flow{to{stroke-dashoffset:-80}}@keyframes reveal{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.pulse,.flow,.reveal{animation:none}}</style>${rect(0, 0, w, h, C.bg, 0)}${body}</svg>\n`;
}
async function save(name, content) {
  await mkdir(new URL("assets/generated/", root), { recursive: true });
  await writeFile(new URL(`assets/generated/${name}.svg`, root), content);
}
const mono = 'class="mono"';
await save(
  "hero",
  svg(
    1200,
    350,
    `${profile.name} — ${profile.role}`,
    `
 ${text(40, 35, "AP / PYTHON BACKEND DEVELOPER", 10, C.muted, mono)}${text(1160, 35, profile.location.toUpperCase(), 10, C.muted, `${mono} text-anchor="end"`)}${line(40, 53, 1160, 53)}
 <g class="reveal">${text(40, 133, profile.name + ".", 65, C.text, 'font-weight="700" letter-spacing="-3"')}${text(44, 183, profile.role, 23, C.lime)}${text(44, 222, profile.tagline, 18, C.muted)}</g>
 ${rect(44, 263, 90, 27, C.lime, 5)}${text(89, 281, "PYTHON", 10, C.bg, `${mono} text-anchor="middle"`)}${rect(144, 263, 90, 27, C.panel, 5)}${text(189, 281, "DJANGO", 10, C.lime, `${mono} text-anchor="middle"`)}${rect(244, 263, 100, 27, C.panel, 5)}${text(294, 281, "REST APIs", 10, C.lime, `${mono} text-anchor="middle"`)}
 <g transform="translate(800 85)">${rect(0, 0, 354, 223, "#102219", 12, `stroke="${C.border}"`)}<circle class="pulse" cx="20" cy="22" r="4" fill="${C.lime}"/>${text(34, 25, "SYSTEM OVERVIEW", 9, C.muted, mono)}${line(0, 42, 354, 42)}${text(22, 75, "GET /api/projects", 15, C.lime, mono)}${rect(22, 95, 310, 44, C.lime, 7)}${text(177, 122, "DJANGO", 14, C.bg, `font-weight="700" text-anchor="middle"`)}<path class="flow" d="M177 140V160H96V172M177 160H263V172" stroke="${C.lime}" fill="none"/>${rect(22, 172, 147, 30)}${rect(183, 172, 149, 30)}${text(95, 191, "POSTGRESQL", 9, C.text, `${mono} text-anchor="middle"`)}${text(257, 191, "CELERY + REDIS", 9, C.text, `${mono} text-anchor="middle"`)}</g>`,
  ),
);
const date = data.fetchedAt.slice(0, 10);
const metrics = [
  ["PUBLIC REPOSITORIES", data.publicRepos],
  ["REPOSITORY STARS", data.stars],
  ["FOLLOWERS", data.followers],
  ["CONTRIBUTIONS / YEAR", data.contributions?.total || 0],
];
await save(
  "dashboard",
  svg(
    1200,
    232,
    "Public GitHub dashboard",
    `${text(30, 32, "GITHUB / PUBLIC ACTIVITY", 11, C.lime, mono)}${text(1170, 32, "UPDATED " + date + " UTC", 9, C.muted, `${mono} text-anchor="end"`)}${metrics
      .map(([label, value], i) => {
        const x = 30 + i * 290;
        return (
          rect(x, 58, 270, 125) +
          text(x + 20, 90, label, 9, C.muted, mono) +
          text(x + 20, 149, number(value), 43, C.text, 'font-weight="700"')
        );
      })
      .join(
        "",
      )}${text(30, 211, "Public GitHub statistics · refreshed automatically", 10, C.muted)}`,
  ),
);
const languages = data.languages.slice(0, 6),
  total = data.languages.reduce((n, x) => n + x[1], 0);
await save(
  "languages",
  svg(
    1200,
    170,
    "Primary languages across original public repositories",
    `${text(30, 31, "LANGUAGE LANDSCAPE", 11, C.lime, mono)}${text(1170, 31, "PRIMARY LANGUAGE / NON-FORK REPOSITORIES", 9, C.muted, `${mono} text-anchor="end"`)}${languages
      .map(([name, count], i) => {
        const x = 30 + (i % 3) * 390,
          y = 66 + Math.floor(i / 3) * 60;
        return (
          text(x, y, name, 13) +
          text(x + 340, y, count + " repos", 10, C.muted, 'text-anchor="end"') +
          rect(x, y + 10, 340, 5, "#30472E", 2) +
          rect(
            x,
            y + 10,
            Math.max(4, (340 * count) / Math.max(1, total)),
            5,
            C.lime,
            2,
          )
        );
      })
      .join("")}`,
  ),
);
const days = [];
for (let i = 89; i >= 0; i--) {
  const d = new Date(data.fetchedAt);
  d.setUTCDate(d.getUTCDate() - i);
  const key = d.toISOString().slice(0, 10);
  days.push({ date: key, count: data.activity?.days[key] || 0 });
}
const max = Math.max(1, ...days.map((d) => d.count));
await save(
  "activity",
  svg(
    1200,
    215,
    "Public repository updates, 90-day timeline",
    `${text(30, 32, "REPOSITORY UPDATES / 90-DAY WINDOW", 11, C.lime, mono)}${text(1170, 32, "EACH REPOSITORY’S LATEST PUSH", 9, C.muted, `${mono} text-anchor="end"`)}${days
      .map((day, i) => {
        const height = Math.max(3, (day.count / max) * 103);
        return `<g><title>${xml(day.date)}: ${day.count} repository updates</title>${rect(32 + i * 12.6, 165 - height, 8, height, day.count ? C.lime : "#2B432D", 3)}</g>`;
      })
      .join(
        "",
      )}${line(30, 169, 1170, 169)}${text(30, 194, days[0].date, 9, C.muted, mono)}${text(1170, 194, days.at(-1).date, 9, C.muted, `${mono} text-anchor="end"`)}`,
  ),
);
for (let i = 0; i < profile.projects.length; i++) {
  const project = profile.projects[i],
    repo = data.repositories.find((repo) => repo.name === project.repo);
  if (!repo) throw new Error(`Featured repository not found: ${project.repo}`);
  await save(
    `project-${project.repo.toLowerCase()}`,
    svg(
      600,
      234,
      project.title,
      `${text(26, 31, String(i + 1).padStart(2, "0") + " / SELECTED WORK", 9, C.muted, mono)}${text(571, 35, "↗", 25, C.lime, 'text-anchor="end"')}${text(26, 80, project.title, 28, C.text, 'font-weight="700" letter-spacing="-.8"')}${text(26, 113, project.description, 15, C.muted)}${text(26, 136, project.detail, 15, C.muted)}${text(26, 174, project.tags, 9, C.lime, mono)}${line(26, 193, 574, 193)}${text(26, 216, `${repo.language || "SOURCE"} · ${repo.stars} ${repo.stars === 1 ? "STAR" : "STARS"}`, 9, C.muted, mono)}${text(574, 216, "UPDATED " + repo.updatedAt.slice(0, 10), 9, C.muted, `${mono} text-anchor="end"`)}`,
    ),
  );
}
const groups = [
  [
    "languages",
    "LANGUAGES",
    [
      ["Python", "python"],
      ["JavaScript", "javascript"],
      ["C++", "cplusplus"],
    ],
  ],
  [
    "backend",
    "BACKEND & BACKGROUND",
    [
      ["Django", "django"],
      ["REST APIs", "rest"],
      ["Flask", "flask"],
      ["Celery", "celery"],
      ["Redis", "redis"],
    ],
  ],
  [
    "frontend",
    "INTERFACE",
    [
      ["React", "react"],
      ["HTML", "html5"],
      ["CSS", "css"],
      ["SCSS", "sass"],
    ],
  ],
  [
    "tooling",
    "DATA & DELIVERY",
    [
      ["PostgreSQL", "postgresql"],
      ["Docker", "docker"],
      ["Git", "git"],
      ["Linux", "linux"],
    ],
  ],
];
for (const [slug, title, tools] of groups) {
  let body = text(24, 31, title, 11, C.lime, mono);
  for (let i = 0; i < tools.length; i++) {
    const [name, file] = tools[i],
      x = 24 + (i % 3) * 183,
      y = 65 + Math.floor(i / 3) * 67;
    let icon = "";
    try {
      const source = await readFile(
        new URL(`assets/icons/${file}.svg`, root),
        "utf8",
      );
      icon = [...source.matchAll(/<path\b[^>]*\/?\s*>/g)]
        .map((m) => m[0])
        .join("");
    } catch {
      icon =
        '<path d="M8 4L2 12L8 20M16 4L22 12L16 20" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
    body +=
      rect(x, y, 169, 52) +
      `<g color="${C.lime}" fill="${C.lime}" transform="translate(${x + 13} ${y + 14})">${icon}</g>` +
      text(x + 48, y + 31, name, 12, C.text);
  }
  await save(`toolkit-${slug}`, svg(600, 213, title, body));
}
await save(
  "contact",
  svg(
    1200,
    135,
    "Contact Adarsh P Baiju",
    `${text(34, 38, "CONTACT", 10, C.muted, mono)}${text(32, 88, "Adarsh P Baiju.", 36, C.text, 'font-weight="700" letter-spacing="-1"')}${rect(1010, 33, 155, 69, C.lime, 12)}${text(1087, 75, "EMAIL ME ↗", 13, C.bg, 'text-anchor="middle" font-weight="700"')}`,
  ),
);

if (data.contributions?.days?.length) {
  const calendar = data.contributions.days;
  const start = new Date(calendar[0].date + "T00:00:00Z");
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const colors = ["#263D2C", "#426036", "#6A8D45", "#9DBD58", C.lime];
  const cells = calendar
    .map((day) => {
      const d = new Date(day.date + "T00:00:00Z");
      const week = Math.floor((d - start) / 86400000 / 7),
        row = d.getUTCDay();
      return (
        "<g><title>" +
        xml(day.date) +
        ": " +
        day.count +
        ' contributions</title><rect class="calendar-cell ' +
        (day.count ? "calendar-active" : "") +
        '" style="animation-delay:' +
        week * 0.018 +
        's" x="' +
        (55 + week * 21) +
        '" y="' +
        (83 + row * 21) +
        '" width="17" height="17" rx="4" fill="' +
        colors[Math.min(4, day.level)] +
        '"/></g>'
      );
    })
    .join("");
  const styles =
    "<style>.calendar-cell{transform-box:fill-box;transform-origin:center;animation:calendar-reveal .65s ease-out both}.calendar-active{animation:calendar-reveal .65s ease-out both,calendar-glow 5s ease-in-out infinite}.calendar-scan{animation:calendar-scan 9s linear infinite}@keyframes calendar-reveal{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}@keyframes calendar-glow{50%{filter:brightness(1.3)}}@keyframes calendar-scan{from{transform:translateX(-90px)}to{transform:translateX(1140px)}}@media(prefers-reduced-motion:reduce){.calendar-cell,.calendar-active,.calendar-scan{animation:none}.calendar-scan{display:none}}</style>";
  await save(
    "contributions",
    svg(
      1200,
      290,
      "Public GitHub contribution calendar",
      styles +
        text(32, 35, "CONTRIBUTIONS / LAST 12 MONTHS", 12, C.lime, mono) +
        text(
          1168,
          36,
          number(data.contributions.total) + " contributions",
          18,
          C.text,
          'text-anchor="end"',
        ) +
        cells +
        '<svg x="55" y="80" width="1110" height="151" viewBox="0 0 1110 151"><rect class="calendar-scan" width="60" height="151" fill="#C7F464" opacity=".045"/></svg>' +
        text(
          32,
          263,
          calendar[0].date + " — " + calendar.at(-1).date,
          10,
          C.muted,
          mono,
        ) +
        text(
          1168,
          263,
          "SOURCE / GITHUB PUBLIC PROFILE",
          9,
          C.muted,
          mono + ' text-anchor="end"',
        ),
    ),
  );
}
await save(
  "profile",
  svg(
    1200,
    325,
    "Profile and current focus",
    `
 ${text(32, 37, "PROFILE", 12, C.lime, mono)}${line(32, 57, 1168, 57)}
 ${rect(32, 80, 650, 214)}${rect(700, 80, 468, 214)}
 ${text(54, 116, "About me", 25, C.text, 'font-weight="700"')}
 ${text(54, 153, "Python backend developer based in Kerala, India.", 18, C.muted)}
 ${text(54, 183, "Building web applications with Django and REST APIs.", 18, C.muted)}
 ${text(54, 227, "Junior Python Developer", 18, C.lime)}
 ${text(54, 256, "Yafei AI Technologies · November 2024 — Present", 16, C.muted)}
 ${text(722, 116, "Current focus", 25, C.text, 'font-weight="700"')}
 ${text(722, 155, "System design and distributed systems", 17, C.muted)}
 ${text(722, 185, "Microservices and backend architecture", 17, C.muted)}
 ${text(722, 229, "PYTHON / DJANGO / REST APIs", 11, C.lime, mono)}
 ${text(722, 262, "CELERY / REDIS / POSTGRESQL", 11, C.muted, mono)}
`,
  ),
);
for (const [slug, label] of [
  ["dashboard", "Dashboard"],
  ["toolkit", "Toolkit"],
  ["projects", "Selected projects"],
  ["contact", "Contact"],
]) {
  await save(
    `heading-${slug}`,
    svg(
      1200,
      76,
      label,
      `${text(32, 48, label, 28, C.text, 'font-weight="700"')}${line(310, 40, 1168, 40)}`,
    ),
  );
}
const nested = async (name, x, y, w, h) => {
  let source = await readFile(
    new URL(`assets/generated/${name}.svg`, root),
    "utf8",
  );
  source = source
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/g, "")
    .replace(/aria-labelledby="title"/g, "");
  return source
    .replace("<svg ", `<svg x="${x}" y="${y}" width="${w}" height="${h}" `)
    .replace(/ width="\d+" height="\d+" viewBox/, " viewBox");
};
await save(
  "toolkit",
  svg(
    1200,
    458,
    "Languages, backend, frontend, data and delivery toolkit",
    (await nested("toolkit-languages", 0, 0, 592, 210)) +
      (await nested("toolkit-backend", 608, 0, 592, 210)) +
      (await nested("toolkit-frontend", 0, 225, 592, 210)) +
      (await nested("toolkit-tooling", 608, 225, 592, 210)),
  ),
);
await save(
  "data-note",
  svg(
    1200,
    50,
    "Dashboard measurement notes",
    text(
      32,
      31,
      "Public GitHub data · Languages counted by repository · Contributions from the public profile calendar",
      13,
      C.muted,
    ),
  ),
);
await save(
  "repositories",
  svg(
    1200,
    64,
    "Browse all public repositories",
    `${text(32, 40, "Browse all repositories", 20, C.text)}${text(1165, 42, "↗", 28, C.lime, 'text-anchor="end"')}`,
  ),
);
for (const [slug, label] of [
  ["email", profile.email],
  ["linkedin", "LinkedIn ↗"],
  ["github", "GitHub ↗"],
]) {
  await save(
    `link-${slug}`,
    svg(
      600,
      90,
      label,
      `${rect(12, 12, 576, 66, C.panel, 8)}${text(300, 54, label, 20, C.lime, 'text-anchor="middle"')}`,
    ),
  );
}
for (const [slug, label] of [
  ["profile", "PROFILE"],
  ["dashboard", "DASHBOARD"],
  ["toolkit", "TOOLKIT"],
  ["selected-projects", "PROJECTS"],
  ["contact", "CONTACT"],
]) {
  await save(
    `nav-${slug}`,
    svg(
      240,
      58,
      label,
      text(120, 36, label, 13, C.lime, `${mono} text-anchor="middle"`),
    ),
  );
}
console.log("Built the complete custom profile asset set.");
