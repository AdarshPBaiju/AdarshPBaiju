import { readFile, readdir, access } from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const root = new URL("../", import.meta.url);
const readme = await readFile(new URL("README.md", root), "utf8");
for (const match of readme.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const path = match[1];
  if (/^[a-z]+:/i.test(path)) continue;
  assert(!path.includes(".."), `Unexpected local traversal: ${path}`);
  const local = new URL(path, root);
  local.search = "";
  local.hash = "";
  await access(local);
  if (path.startsWith("assets/rendered/")) {
    const hash = path.match(/--([a-f0-9]{12})\.svg$/)?.[1];
    assert(hash, `Image must have an immutable content filename: ${path}`);
    assert.equal(
      createHash("sha256")
        .update(await readFile(local))
        .digest("hex")
        .slice(0, 12),
      hash,
      `Stale image version: ${path}`,
    );
  }
}
const names = await readdir(new URL("assets/generated/", root));
for (const name of names) {
  const content = await readFile(
    new URL(`assets/generated/${name}`, root),
    "utf8",
  );
  assert(
    content.startsWith("<svg") && content.trimEnd().endsWith("</svg>"),
    `Invalid SVG wrapper: ${name}`,
  );
  assert(
    !/<script|foreignObject|(?:NaN|undefined|Infinity)/i.test(content),
    `Unexpected SVG content: ${name}`,
  );
  assert(content.includes("<title"), `Missing accessible SVG title: ${name}`);
}
const profile = JSON.parse(
  await readFile(new URL("data/profile.json", root), "utf8"),
);
const data = JSON.parse(
  await readFile(new URL("data/github.json", root), "utf8"),
);
assert.equal(profile.username, data.username);
assert(
  !profile.projects.some((p) => p.repo === "adarsh-portfolio"),
  "Portfolio must not be featured",
);
assert.equal(
  new Set(profile.projects.map((p) => p.repo)).size,
  profile.projects.length,
  "Duplicate featured projects",
);
assert(
  !readme.includes("github-stats-extended") &&
    !readme.includes("capsule-render"),
  "All displayed graphics must be local",
);
console.log(
  `Validated README references, ${names.length} SVG assets, and ${profile.projects.length} featured repositories.`,
);
