// Minimal Bun-only preview server. Build once, then visit http://localhost:3000.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.map':'application/json' };
const pathFor = (pathname) => {
  const clean = pathname === '/' ? '/index.html' : pathname;
  if (clean.includes('..')) return null;
  return join(root, clean.slice(1));
};
Bun.serve({
  port: 3000,
  fetch(req) {
    const path = pathFor(new URL(req.url).pathname);
    const file = path && Bun.file(path);
    if (!file || !file.size) return new Response('Not found — run bun run build first.', { status:404 });
    const type = mime[path.slice(path.lastIndexOf('.'))] || 'application/octet-stream';
    return new Response(file, { headers:{ 'content-type':type, 'cache-control':'no-store' } });
  }
});
