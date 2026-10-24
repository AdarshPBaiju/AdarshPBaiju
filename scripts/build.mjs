import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { xml } from "./lib.mjs";
import { motionCss, hero, projectPreview, calendarArtwork } from "./motion.mjs";
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
  `<text x="${x}" y="${y}" font-size="${Math.max(11, size)}" fill="${color}" ${extra}>${xml(value)}</text>`;
const rect = (x, y, w, h, fill = C.panel, rx = 12, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const line = (x, y, x2, y2) =>
  `<path d="M${x} ${y}L${x2} ${y2}" stroke="${C.border}" fill="none"/>`;
function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${xml(title)}</title><style>${motionCss}</style>${rect(0, 0, w, h, C.bg, 0)}${body}</svg>\n`;
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
    380,
    profile.name + " — " + profile.role,
    hero(profile, { text, rect, line, C, mono }),
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
    260,
    "Public GitHub dashboard",
    text(30, 34, "GITHUB / PUBLIC ACTIVITY", 13, C.lime, mono) +
      text(
        1170,
        34,
        "UPDATED " + date + " UTC",
        11,
        C.muted,
        mono + ' text-anchor="end"',
      ) +
      metrics
        .map(([label, value], i) => {
          const x = 30 + i * 290;
          return (
            '<g class="motion-rise" style="--delay:' +
            i * 0.12 +
            's">' +
            rect(x, 61, 270, 146, C.panel, 12, 'stroke="' + C.border + '"') +
            '<rect class="motion-border" x="' +
            x +
            '" y="61" width="270" height="146" rx="12"/>' +
            text(x + 19, 92, label, 11, C.muted, mono) +
            '<g class="motion-number" style="--delay:' +
            (i * 0.12 + 0.2) +
            's">' +
            text(
              x + 19,
              157,
              number(value),
              52,
              C.text,
              'font-weight="700" letter-spacing="-2"',
            ) +
            "</g>" +
            text(
              x + 19,
              189,
              [
                "Owned public repositories",
                "Across public repositories",
                "GitHub followers",
                "Public contribution calendar",
              ][i],
              12,
              C.muted,
            ) +
            "</g>"
          );
        })
        .join("") +
      text(30, 238, "Automatic refresh / GitHub Actions", 11, C.muted, mono),
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
            'class="motion-bar"',
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
  if (!repo) throw new Error("Featured repository not found: " + project.repo);
  await save(
    "project-" + project.repo.toLowerCase(),
    svg(
      600,
      374,
      project.title,
      text(
        24,
        29,
        String(i + 1).padStart(2, "0") + " / SELECTED WORK",
        11,
        C.muted,
        mono,
      ) +
        text(576, 33, "↗", 25, C.lime, 'text-anchor="end"') +
        '<g class="motion-rise">' +
        text(
          24,
          72,
          project.title,
          30,
          C.text,
          'font-weight="700" letter-spacing="-.8"',
        ) +
        "</g>" +
        projectPreview(project.repo, { rect, line, C }) +
        text(
          563,
          117,
          "INTERFACE STUDY",
          9,
          C.muted,
          mono + ' text-anchor="end"',
        ) +
        text(24, 255, project.description, 15, C.muted) +
        text(24, 279, project.detail, 15, C.muted) +
        text(24, 313, project.tags, 11, C.lime, mono) +
        line(24, 333, 576, 333) +
        text(
          24,
          358,
          (repo.language || "SOURCE") +
            " · " +
            repo.stars +
            " " +
            (repo.stars === 1 ? "STAR" : "STARS"),
          11,
          C.muted,
          mono,
        ) +
        text(
          576,
          358,
          "UPDATED " + repo.updatedAt.slice(0, 10),
          11,
          C.muted,
          mono + ' text-anchor="end"',
        ),
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
  let body = text(24, 32, title, 14, C.lime, mono);
  for (let i = 0; i < tools.length; i++) {
    const [name, file] = tools[i],
      x = 24 + (i % 3) * 183,
      y = 64 + Math.floor(i / 3) * 76;
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
      '<g class="motion-rise" style="--delay:' +
      i * 0.12 +
      's">' +
      rect(x, y, 169, 62, C.panel, 9) +
      '<g transform="translate(' +
      (x + 13) +
      " " +
      (y + 19) +
      ')"><g class="motion-float" style="--delay:' +
      i * 0.5 +
      's" color="' +
      C.lime +
      '" fill="' +
      C.lime +
      '">' +
      icon +
      "</g></g>" +
      text(x + 47, y + 37, name, 14, C.text) +
      "</g>";
  }
  await save(`toolkit-${slug}`, svg(600, 235, title, body));
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

if (data.contributions?.days?.length)
  await save(
    "contributions",
    svg(
      1200,
      310,
      "Animated public GitHub contribution calendar",
      calendarArtwork(
        data.contributions.days,
        number(data.contributions.total),
        { text, rect, C, mono },
      ),
    ),
  );
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
    500,
    "Languages, backend, frontend, data and delivery toolkit",
    (await nested("toolkit-languages", 0, 0, 592, 232)) +
      (await nested("toolkit-backend", 608, 0, 592, 232)) +
      (await nested("toolkit-frontend", 0, 248, 592, 232)) +
      (await nested("toolkit-tooling", 608, 248, 592, 232)),
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
  const width = slug === "email" ? 408 : 396;
  await save(
    `footer-${slug}-v2`,
    svg(
      width,
      90,
      label,
      `${rect(12, 12, width - 24, 66, C.panel, 8)}${text(width / 2, 54, label, slug === "email" ? 16 : 18, C.lime, 'text-anchor="middle"')}`,
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
// Content-derived versions let GitHub request updated artwork after a stats refresh.
const readmeUrl = new URL("README.md", root);
let readme = await readFile(readmeUrl, "utf8");
const imageSources = [
  ...new Set(
    [
      ...readme.matchAll(
        /src="(assets\/generated\/[^"?]+\.svg)(?:\?[^\"]*)?"/g,
      ),
    ].map((match) => match[1]),
  ),
];
for (const source of imageSources) {
  const content = await readFile(new URL(source, root));
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 12);
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  readme = readme.replace(
    new RegExp(`src="${escaped}(?:\\?[^\\"]*)?"`, "g"),
    `src="${source}?v=${hash}"`,
  );
}
await writeFile(readmeUrl, readme);
console.log("Built the complete custom profile asset set.");
