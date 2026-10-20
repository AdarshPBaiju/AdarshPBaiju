export const xml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );

export function parseContributions(html) {
  const tips = new Map();
  for (const match of html.matchAll(
    /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g,
  )) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    const content = match[2].replace(/<[^>]+>/g, "");
    const count = /^\s*No contributions?\b/i.test(content)
      ? 0
      : Number(
          content.match(/([\d,]+) contributions?\b/i)?.[1]?.replaceAll(",", ""),
        );
    if (id && Number.isFinite(count)) tips.set(id, count);
  }
  const days = [];
  for (const match of html.matchAll(
    /<td\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*>/g,
  )) {
    const date = match[0].match(/data-date="([^"]+)"/)?.[1];
    const id = match[0].match(/\bid="([^"]+)"/)?.[1];
    const level = Number(match[0].match(/data-level="(\d+)"/)?.[1]);
    const count = tips.get(id);
    if (count === undefined || !Number.isFinite(level))
      throw new Error(
        "GitHub contribution markup changed; refusing to generate incorrect counts.",
      );
    days.push({ date, count, level });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}
export function summarize(user, repos, activity) {
  const owned = repos.filter(
    (repo) =>
      repo.owner?.login?.toLowerCase() === user.login.toLowerCase() &&
      !repo.private,
  );
  const originals = owned.filter((repo) => !repo.fork);
  const languages = {};
  for (const repo of originals)
    if (repo.language)
      languages[repo.language] = (languages[repo.language] || 0) + 1;
  return {
    username: user.login,
    fetchedAt: new Date().toISOString(),
    followers: user.followers,
    publicRepos: user.public_repos,
    stars: owned.reduce((n, repo) => n + repo.stargazers_count, 0),
    forks: owned.reduce((n, repo) => n + repo.forks_count, 0),
    languages: Object.entries(languages).sort((a, b) => b[1] - a[1]),
    activity: activity || null,
    repositories: owned.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.pushed_at,
      url: repo.html_url,
    })),
  };
}
