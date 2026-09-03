const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const safePath = pathname.replace(/^\/+/, '').replaceAll('..', '');
    const file = Bun.file(safePath);
    const extension = safePath.slice(safePath.lastIndexOf('.'));
    return new Response(await file.arrayBuffer(), {
      headers: { 'Content-Type': mime[extension] || 'application/octet-stream' },
    });
  },
});

console.log(`潮汐之后 · http://localhost:${server.port}`);
