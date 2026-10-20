import { test } from "node:test";
import assert from "node:assert/strict";
import { xml, summarize } from "./lib.mjs";

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
