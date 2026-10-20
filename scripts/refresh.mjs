import { readFile, writeFile } from "node:fs/promises";
import { summarize, parseContributions } from "./lib.mjs";
const profile = JSON.parse(
  await readFile(new URL("../data/profile.json", import.meta.url), "utf8"),
);
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "adarsh-profile-dashboard",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN)
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function api(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(
      `GitHub request ${path} failed (${response.status}). Existing generated assets were preserved.`,
    );
  return response.json();
}
const user = await api(`/users/${encodeURIComponent(profile.username)}`);
const repos = [];
for (let page = 1; page <= 50; page++) {
  const batch = await api(
    `/users/${encodeURIComponent(profile.username)}/repos?type=owner&per_page=100&page=${page}`,
  );
  repos.push(...batch);
  if (batch.length < 100) break;
}
const cutoff = new Date();
cutoff.setUTCDate(cutoff.getUTCDate() - 90);
const byDay = {};
for (const repo of repos) {
  if (!repo.pushed_at || new Date(repo.pushed_at) < cutoff) continue;
  const date = repo.pushed_at.slice(0, 10);
  byDay[date] = (byDay[date] || 0) + 1;
}
const activity = {
  total: Object.values(byDay).reduce((sum, n) => sum + n, 0),
  days: byDay,
  windowDays: 90,
  metric: "latest-repository-push",
};
const data = summarize(user, repos, activity);
const calendarResponse = await fetch(
  `https://github.com/users/${encodeURIComponent(profile.username)}/contributions`,
  {
    headers: { "User-Agent": "adarsh-profile-dashboard", Accept: "text/html" },
    signal: AbortSignal.timeout(30000),
  },
);
if (!calendarResponse.ok)
  throw new Error(
    `Contribution calendar failed (${calendarResponse.status}); existing assets preserved.`,
  );
const contributionDays = parseContributions(await calendarResponse.text());
if (contributionDays.length < 300)
  throw new Error(
    "Contribution calendar is incomplete; existing assets preserved.",
  );
data.contributions = {
  days: contributionDays,
  total: contributionDays.reduce((n, day) => n + day.count, 0),
  source: "public-github-calendar",
};
await writeFile(
  new URL("../data/github.json", import.meta.url),
  `${JSON.stringify(data, null, 2)}\n`,
);
console.log(
  `Refreshed public profile data: ${repos.length} repositories, ${activity.total} repositories active in 90 days.`,
);
