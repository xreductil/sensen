const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_SOURCE = path.join(ROOT, "data", "images");
const sharpCandidates = [
  path.join(ROOT, "node_modules", "sharp"),
  path.join(ROOT, "sensen-api", "node_modules", "sharp"),
];

let sharp;
for (const candidate of sharpCandidates) {
  try {
    sharp = require(candidate);
    break;
  } catch {
    // Try the next local installation.
  }
}

if (!sharp) {
  console.error("找不到 sharp。請先在專案或 sensen-api 目錄安裝 sharp。");
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const sourceDirectory = process.argv.find((value) => value.startsWith("--source="))?.slice("--source=".length) || DEFAULT_SOURCE;
const qualityArgument = Number(process.argv.find((value) => value.startsWith("--quality="))?.slice("--quality=".length) || 82);
const quality = Number.isFinite(qualityArgument) ? Math.min(100, Math.max(1, qualityArgument)) : 82;
const force = args.has("--force");

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const filePath = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(filePath) : [filePath];
});

const inputs = walk(path.resolve(sourceDirectory)).filter((filePath) => /\.(?:jpe?g|png)$/i.test(filePath));
const basenameCounts = new Map();
for (const inputPath of inputs) {
  const basename = path.basename(inputPath).replace(/\.(?:jpe?g|png)$/i, "").toLowerCase();
  basenameCounts.set(basename, (basenameCounts.get(basename) || 0) + 1);
}
let converted = 0;
let skipped = 0;
let sourceBytes = 0;
let outputBytes = 0;

const convert = async (inputPath) => {
  const extension = path.extname(inputPath).slice(1).toLowerCase();
  const basename = path.basename(inputPath).replace(/\.(?:jpe?g|png)$/i, "").toLowerCase();
  const outputPath = basenameCounts.get(basename) > 1
    ? inputPath.replace(/\.(?:jpe?g|png)$/i, `-${extension}.webp`)
    : inputPath.replace(/\.(?:jpe?g|png)$/i, ".webp");
  const inputStat = fs.statSync(inputPath);
  if (!force && fs.existsSync(outputPath) && fs.statSync(outputPath).mtimeMs >= inputStat.mtimeMs) {
    skipped += 1;
    return;
  }

  const result = await sharp(inputPath)
    .rotate()
    .webp({ quality, effort: 4, smartSubsample: true })
    .toFile(outputPath);
  converted += 1;
  sourceBytes += inputStat.size;
  outputBytes += result.size;
  if (converted === 1 || converted % 50 === 0 || converted === inputs.length - skipped) {
    console.log(`已轉換 ${converted}/${inputs.length - skipped}: ${path.relative(ROOT, inputPath)}`);
  }
};

if (!fs.existsSync(sourceDirectory)) {
  console.error(`找不到圖片目錄：${sourceDirectory}`);
  process.exit(1);
}

Promise.all(inputs.map(convert))
  .then(() => {
    const saved = sourceBytes ? Math.round((1 - outputBytes / sourceBytes) * 100) : 0;
    console.log(`WebP 轉檔完成：新增/更新 ${converted} 張，略過 ${skipped} 張。`);
    if (converted) console.log(`本次轉檔容量約減少 ${saved}%（${sourceBytes} → ${outputBytes} bytes）。`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
