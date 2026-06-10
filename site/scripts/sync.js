import fs from 'fs';
import path from 'path';

const src = path.resolve('../outputs');
const dest = path.resolve('public/outputs');

console.log(`Syncing from ${src} to ${dest}...`);

try {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log('Outputs synchronized successfully!');
} catch (err) {
  console.error('Failed to sync outputs:', err);
  process.exit(1);
}
