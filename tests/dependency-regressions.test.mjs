import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const readJSON = async (name) => JSON.parse(await readFile(path.join(root, name), "utf8"));
const calendar = await readJSON("public/r/calendar.json");
const calendarFile = calendar.files.find((file) => file.target === "components/ui/calendar.tsx");

test("published calendar matches source and declares its dependencies", async () => {
  assert.equal(calendarFile.content, await readFile(path.join(root, "src/components/ui/calendar.tsx"), "utf8"));
  const pkg = await readJSON("package.json");
  assert.ok(calendar.dependencies.includes(`react-day-picker@${pkg.dependencies["react-day-picker"]}`));
  assert.ok(calendar.registryDependencies.includes("https://www.vengenceui.com/r/button.json"));
  assert.match(calendarFile.content, /month_grid: "w-full border-collapse"/);
  assert.doesNotMatch(calendarFile.content, /\btable:/);
});

test("installable calendar and button payloads typecheck against locked dependencies", async () => {
  // Virtual consumer tree: do not silently resolve UI imports to repository source.
  const consumer = path.join(root, ".registry-typecheck");
  const button = await readJSON("public/r/button.json");
  const files = new Map([
    [path.join(consumer, "components/ui/calendar.tsx"), calendarFile.content],
    [path.join(consumer, "components/ui/button.tsx"), button.files[0].content],
    [path.join(consumer, "lib/utils.ts"), await readFile(path.join(root, "src/lib/utils.ts"), "utf8")],
  ]);
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  assert.equal(config.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  assert.deepEqual(parsed.errors, []);
  const options = {
    ...parsed.options,
    noEmit: true,
    incremental: false,
    paths: { "@/*": [path.join(consumer, "*")] },
  };
  const host = ts.createCompilerHost(options);
  const { fileExists, directoryExists, readFile: readSource, getSourceFile } = host;
  host.fileExists = (name) => files.has(name) || fileExists(name);
  host.directoryExists = (name) => [...files.keys()].some((file) => file.startsWith(name + path.sep)) || directoryExists(name);
  host.readFile = (name) => files.get(name) ?? readSource(name);
  host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) => files.has(name)
    ? ts.createSourceFile(name, files.get(name), languageVersion, true)
    : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([...files.keys()], options, host);
  const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
    file: diagnostic.file?.fileName,
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
  }));
  assert.deepEqual(errors, []);
});

test("previously weakened lint rules remain error-level for new code", async () => {
  const eslint = new ESLint({ cwd: root });
  const config = await eslint.calculateConfigForFile(path.join(root, "src/new-component.tsx"));
  for (const rule of [
    "@next/next/no-html-link-for-pages",
    "@typescript-eslint/ban-ts-comment",
    "@typescript-eslint/no-empty-object-type",
    "@typescript-eslint/no-explicit-any",
    "@typescript-eslint/no-require-imports",
    "@typescript-eslint/no-unsafe-function-type",
    "prefer-const",
    "react-hooks/immutability",
    "react-hooks/purity",
    "react-hooks/refs",
    "react-hooks/set-state-in-effect",
    "react/no-unescaped-entities",
  ]) assert.equal(config.rules[rule][0], 2, `${rule} must remain an error`);
});

test("lint baseline rejects new-file errors, increased counts and stale suppressions", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "vengeance-lint-regression-"));
  try {
    const existingPath = "src/existing-component.tsx";
    const newPath = "src/new-component.tsx";
    // Keep the fixture independent of particular debt entries so fixing and
    // pruning a real file does not require rewriting this regression test.
    const baseline = { [existingPath]: { "@typescript-eslint/no-explicit-any": { count: 1 } } };
    await mkdir(path.dirname(path.join(fixture, existingPath)), { recursive: true });
    await writeFile(path.join(fixture, "eslint-suppressions.json"), JSON.stringify(baseline));
    const original = "export type Existing = any;\n";
    await writeFile(path.join(fixture, existingPath), original);
    const eslintBin = path.join(path.dirname(require.resolve("eslint/package.json")), "bin/eslint.js");
    const lint = () => {
      const result = spawnSync(process.execPath, [eslintBin, "src", "--config", path.join(root, "eslint.config.mjs"), "--format", "json"], {
        cwd: fixture,
        encoding: "utf8",
        timeout: 30_000,
      });
      assert.ifError(result.error);
      return result;
    };
    const initial = lint();
    assert.equal(initial.status, 0, initial.stderr + initial.stdout);
    assert.equal(JSON.parse(initial.stdout)[0].suppressedMessages.length, 1);

    await writeFile(path.join(fixture, newPath), "export type NewViolation = any;\n");
    const addedFile = lint();
    assert.equal(addedFile.status, 1, addedFile.stderr + addedFile.stdout);
    assert.ok(JSON.parse(addedFile.stdout).some((file) => file.messages.some((message) => message.ruleId === "@typescript-eslint/no-explicit-any" && message.severity === 2)));
    await rm(path.join(fixture, newPath));

    await writeFile(path.join(fixture, existingPath), original + "export type AdditionalViolation = any;\n");
    const increased = lint();
    assert.equal(increased.status, 1, increased.stderr + increased.stdout);
    assert.equal(JSON.parse(increased.stdout)[0].errorCount, 2);

    await writeFile(path.join(fixture, existingPath), "export type Fixed = unknown;\n");
    const stale = lint();
    assert.notEqual(stale.status, 0, "removed violations must require pruning the baseline");
    assert.match(stale.stderr + stale.stdout, /suppression/i);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
