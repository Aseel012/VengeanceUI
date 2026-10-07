import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(await readFile(path.join(root, "public/r/share-sheet.json"), "utf8"));
const source = registry.files.find((file) => file.target === "components/ui/share-sheet.tsx");

test("share sheet registry publishes current source and discovery metadata", async () => {
  assert.equal(source.content, await readFile(path.join(root, "src/components/ui/share-sheet.tsx"), "utf8"));
  assert.equal(registry.type, "registry:ui");
  const aggregate = JSON.parse(await readFile(path.join(root, "public/r/registry.json"), "utf8"));
  const entry = aggregate.find((item) => item.name === "share-sheet");
  assert.ok(entry, "Share Sheet must be discoverable through the aggregate registry");
  assert.deepEqual(entry.files, ["public/r/share-sheet.json"]);
  assert.deepEqual(entry.dependencies, registry.dependencies);
  assert.ok(registry.dependencies.includes("framer-motion"));
  assert.ok(registry.dependencies.includes("qrcode-generator"));
});

test("installable share sheet typechecks as a standalone consumer component", () => {
  const fileName = path.join(root, ".registry-typecheck/components/ui/share-sheet.tsx");
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  assert.equal(config.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  assert.deepEqual(parsed.errors, []);
  const options = { ...parsed.options, noEmit: true, incremental: false, paths: {} };
  const host = ts.createCompilerHost(options);
  const { fileExists, readFile: readSource, getSourceFile } = host;
  host.fileExists = (name) => name === fileName || fileExists(name);
  host.readFile = (name) => name === fileName ? source.content : readSource(name);
  host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) => name === fileName
    ? ts.createSourceFile(name, source.content, languageVersion, true)
    : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([fileName], options, host);
  const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
    file: diagnostic.file?.fileName,
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
  }));
  assert.deepEqual(errors, []);
});
