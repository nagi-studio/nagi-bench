const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'prof');
const f = fs.readdirSync(dir).filter((x) => x.endsWith('.cpuprofile')).sort().pop();
const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const byId = {};
for (const n of p.nodes) byId[n.id] = n;
const cnt = {};
for (const s of p.samples) cnt[s] = (cnt[s] || 0) + 1;
const self = {};
for (const id in cnt) {
  const n = byId[id];
  const k = n.callFrame.functionName + ':' + n.callFrame.lineNumber;
  self[k] = (self[k] || 0) + cnt[id];
}
const total = p.samples.length;
Object.entries(self)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([k, v]) => console.log(((v / total) * 100).toFixed(1) + '%', k));
