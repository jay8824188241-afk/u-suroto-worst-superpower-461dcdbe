import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The worst superpower: a short description, a few lines at most,
// each line no longer than 280 characters.
const ENTRY =
  "The power to hear everyone's thoughts about you \u2014 but only the unkind ones, played on an endless loop, with no off switch and no volume control.\n";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "./output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read back and verify byte-identical, non-empty,
// and within the format rules (few lines, each line <= 280 chars).
const actual = readFileSync(outPath, "utf8");
if (actual !== ENTRY) {
  throw new Error("entry.txt is not byte-identical to the expected entry");
}
if (Buffer.byteLength(actual, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("entry.txt byte length does not match the expected entry");
}
if (actual.length === 0) {
  throw new Error("entry.txt is empty");
}
const lines = actual.replace(/\n$/, "").split("\n");
if (lines.length > 5) {
  throw new Error(`entry has too many lines: ${lines.length}`);
}
for (const line of lines) {
  if (line.length > 280) {
    throw new Error(`entry line exceeds 280 chars: ${line.length}`);
  }
}

console.log(`Wrote ${outPath} (${actual.length} chars, ${lines.length} line(s)).`);
