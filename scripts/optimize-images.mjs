import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/img';
const MAX_KB = 500;
const MAX_WIDTH = 1920;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const files = walk(ROOT).filter((file) => /\.(png|jpe?g)$/i.test(file));
for (const file of files) {
  const kb = statSync(file).size / 1024;
  const webp = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const quality = kb > 1500 ? 72 : 80;
  await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(webp);
  const outKb = statSync(webp).size / 1024;
  console.log(
    `${file} ${kb.toFixed(1)}KB -> ${webp} ${outKb.toFixed(1)}KB${outKb > MAX_KB ? ' OVER_LIMIT' : ''}`,
  );
  if (outKb > MAX_KB) {
    await sharp(file)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 62, effort: 6 })
      .toFile(webp);
    console.log(`  retry ${webp} ${(statSync(webp).size / 1024).toFixed(1)}KB`);
  }
}
