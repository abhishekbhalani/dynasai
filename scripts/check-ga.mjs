import { existsSync, readFileSync } from 'node:fs';

const raw = existsSync('.env') ? readFileSync('.env', 'utf8') : '';
const match = raw.match(/^PUBLIC_GA_MEASUREMENT_ID=(.*)$/m);
const value = (match ? match[1] : '').trim().replace(/^['"]|['"]$/g, '');

if (!value) {
  console.log('PUBLIC_GA_MEASUREMENT_ID: empty');
  process.exit(1);
}

if (!/^G-[A-Z0-9]+$/i.test(value)) {
  const prefix = value.slice(0, 4);
  console.log(`PUBLIC_GA_MEASUREMENT_ID: set (${value.length} chars, starts ${prefix}…) but needs format G-XXXXXXXX`);
  process.exit(1);
}

console.log('PUBLIC_GA_MEASUREMENT_ID: valid G- ID');
