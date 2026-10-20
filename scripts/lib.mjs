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
