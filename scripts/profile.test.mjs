import { test } from "node:test";
import assert from "node:assert/strict";
import { xml, summarize, parseContributions } from "./lib.mjs";

test("reads dated public contribution cells with accurate counts", () => {
  const html =
    '<td data-date="2026-10-20" id="today" data-level="2"></td><td data-level="0" id="yesterday" data-date="2026-10-19"></td><tool-tip for="today">12 contributions on October 20th.</tool-tip><tool-tip for="yesterday">No contributions on October 19th.</tool-tip>';
  assert.deepEqual(parseContributions(html), [
    { date: "2026-10-19", count: 0, level: 0 },
    { date: "2026-10-20", count: 12, level: 2 },
  ]);
});
test("rejects unknown contribution markup instead of inventing zero counts", () => {
  assert.throws(
    () =>
      parseContributions(
        '<td data-date="2026-10-20" id="missing" data-level="2"></td>',
      ),
    /markup changed/,
  );
});

test("escapes profile content before placing it inside an SVG", () => {
  assert.equal(
    xml('<script a="b">&\'text'),
    "&lt;script a=&quot;b&quot;&gt;&amp;&apos;text",
  );
});
test("aggregates owned public repositories without counting private or unrelated projects", () => {
  const repo = {
    owner: { login: "adarsh" },
    private: false,
    name: "one",
    fork: false,
    language: "Python",
    stargazers_count: 3,
    forks_count: 1,
  };
  const result = summarize(
    { login: "Adarsh", followers: 8, public_repos: 2 },
    [
      repo,
      { ...repo, name: "fork", fork: true, stargazers_count: 1 },
      { ...repo, private: true, stargazers_count: 100 },
      { ...repo, owner: { login: "someone-else" }, stargazers_count: 100 },
    ],
    null,
  );
  assert.equal(result.stars, 4);
  assert.equal(result.forks, 2);
  assert.equal(result.repositories.length, 2);
  assert.deepEqual(result.languages, [["Python", 1]]);
  assert.equal(result.followers, 8);
});
