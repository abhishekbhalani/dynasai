import fs from 'node:fs';

const src = fs.readFileSync('public/img/transparent-logo.svg', 'utf8');
const pathBlocks = [...src.matchAll(/<path[\s\S]*?\/>/g)];

function pathBounds(d) {
  const nums = [...d.matchAll(/[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g)].map((m) => +m[0]);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

function isTagline(bounds) {
  const height = bounds.maxY - bounds.minY;
  const width = bounds.maxX - bounds.minX;
  // Small glyphs on the right in the lower band only.
  return bounds.minX >= 505 && bounds.minY >= 603 && height <= 28 && width <= 140;
}

const wordmarkPaths = [];
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

let skippedNoD = 0;
let skippedTagline = 0;

const excludedSamples = [];

for (const block of pathBlocks) {
  const full = block[0];
  const dMatch = full.match(/ d="([\s\S]*?)"/);
  if (!dMatch) {
    skippedNoD += 1;
    continue;
  }
  const d = dMatch[1];
  const bounds = pathBounds(d);
  if (isTagline(bounds)) {
    skippedTagline += 1;
    if (excludedSamples.length < 5) excludedSamples.push(bounds);
    continue;
  }
  wordmarkPaths.push(full);
  minX = Math.min(minX, bounds.minX);
  minY = Math.min(minY, bounds.minY);
  maxX = Math.max(maxX, bounds.maxX);
  maxY = Math.max(maxY, bounds.maxY);
}

const pad = 10;
const viewBox = [
  Math.floor(minX - pad),
  Math.floor(minY - pad),
  Math.ceil(maxX - minX + pad * 2),
  Math.ceil(maxY - minY + pad * 2),
].join(' ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg"
shape-rendering="geometricPrecision"
viewBox="${viewBox}" width="${Math.ceil(maxX - minX + pad * 2)}" height="${Math.ceil(maxY - minY + pad * 2)}">
  <metadata>null</metadata>

${wordmarkPaths.join('\n')}

</svg>`;

fs.writeFileSync('public/img/logo-mark.svg', svg);

const coloredSrc = fs.readFileSync('public/img/colored-logo.svg', 'utf8');
const coloredSvg = svg.replace(
  '<svg xmlns="http://www.w3.org/2000/svg"',
  `<svg xmlns="http://www.w3.org/2000/svg"`,
).replace(
  '<metadata>null</metadata>',
  `<rect width="100%" height="100%" fill="#FCFCFD" />\n  <metadata>null</metadata>`,
);

fs.writeFileSync('public/img/logo-mark-colored.svg', coloredSvg);

console.log(JSON.stringify({ viewBox, paths: wordmarkPaths.length, total: pathBlocks.length, skippedNoD, skippedTagline, excludedSamples, minX, minY, maxX, maxY }, null, 2));
