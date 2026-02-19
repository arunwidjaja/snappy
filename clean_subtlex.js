// Parses src/data/subtlex.xlsx (sheet: out1g) and writes filtered words to src/data/words2.json
// Run with: node parse-subtlex.js

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "src/data/subtlex.xlsx");
const OUTPUT = path.join(__dirname, "src/data/words.json");

const ALLOWED_POS = new Set(["Noun", "Adjective", "Verb"]);
const MIN_WORD_LENGTH = 4;
const MIN_LG10CD = 0.6;
const MIN_ZIPF = 2.41;
const MAX_ZIPF = 6.0;

const workbook = XLSX.readFile(INPUT);
const sheet = workbook.Sheets["out1g"];
if (!sheet) {
  console.error('Sheet "out1g" not found. Available sheets:', workbook.SheetNames);
  process.exit(1);
}

const rows = XLSX.utils.sheet_to_json(sheet);
console.log(`Total rows in sheet: ${rows.length}`);

const filtered = rows.filter((row) => {
  const word = String(row["Word"] ?? "").trim();
  if (word.length <= MIN_WORD_LENGTH - 1) return false;                   // rule 1: length > 3
  if (row["FREQlow"] < 2 || row["Cdlow" < 2]) return false;                     // rule 2: FREQlow and Cdlow non-zero
  if (!ALLOWED_POS.has(row["Dom_PoS_SUBTLEX"])) return false;             // rule 3: allowed POS
  if (parseFloat(row["Lg10CD"]) < MIN_LG10CD) return false;               // rule 4: Lg10CD >= 0.6
  const zipf = parseFloat(row["Zipf-value"]);
  if (zipf < MIN_ZIPF || zipf > MAX_ZIPF) return false;                   // rule 5: Zipf in [2.41, 6.0]
  return true;
});

console.log(`Rows after filtering: ${filtered.length}`);

const words = filtered.map((row) => ({
  word: String(row["Word"]).trim().toLowerCase(),
  score: 1,
  value: 1,
}));

// Deduplicate (keep first occurrence)
const seen = new Set();
const unique = words.filter(({ word }) => {
  if (seen.has(word)) return false;
  seen.add(word);
  return true;
});

console.log(`Unique words: ${unique.length}`);

fs.writeFileSync(OUTPUT, JSON.stringify(unique, null, 2));
console.log(`Done. Wrote ${unique.length} words to ${OUTPUT}`);
