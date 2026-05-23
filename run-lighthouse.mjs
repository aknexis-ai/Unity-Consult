import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const pages = [
  { name: "About", url: "http://127.0.0.1:3007/about" },
  { name: "Contact", url: "http://127.0.0.1:3007/contact" },
];

const results = [];

for (const { name, url } of pages) {
  console.log(`\n=== Lighthouse: ${name} ===`);
  const outFile = `lh-${name.toLowerCase()}.json`;
  try {
    execSync(
      `npx lighthouse "${url}" --output=json --chrome-flags="--headless --no-sandbox" --quiet > "${outFile}" 2>&1`,
      { timeout: 120_000, shell: true }
    );
    const data = JSON.parse(execSync(`node -e "console.log(JSON.stringify(require('./${outFile}')))"`, { shell: true }).toString());
    const perf = data.categories?.performance;
    const m = data.audits?.metrics?.details?.items?.[0] || {};
    const score = Math.round((perf?.score || 0) * 100);
    const lcp = Math.round(m.largestContentfulPaint || 0);
    const fcp = Math.round(m.firstContentfulPaint || 0);
    const tbt = Math.round(m.totalBlockingTime || 0);
    const cls = Number(m.cumulativeLayoutShift || 0).toFixed(4);
    const si = Math.round(m.speedIndex || 0);
    console.log(`Score: ${score}`);
    console.log(`LCP: ${lcp}ms`);
    console.log(`FCP: ${fcp}ms`);
    console.log(`TBT: ${tbt}ms`);
    console.log(`CLS: ${cls}`);
    console.log(`SI: ${si}ms`);
    results.push({ name, score, lcp, fcp, tbt, cls, si });
    unlinkSync(outFile);
  } catch (e) {
    console.error(`Error on ${name}:`, e.message);
  }
}

console.log("\n\n=== FINAL RESULTS ===");
console.table(results);
