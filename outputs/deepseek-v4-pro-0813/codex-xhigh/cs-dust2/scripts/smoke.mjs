const target = process.argv[2];
if (!target) throw new Error('Missing DevTools WebSocket URL');

const ws = new WebSocket(target);
let nextId = 1;
const pending = new Map();

ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const entry = pending.get(message.id);
  if (!entry) return;
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
  else entry.resolve(message.result);
});

await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send('Runtime.enable');
const expression = `(() => {
  const canvas = document.querySelector('canvas');
  const menu = document.querySelector('.start-screen');
  return {
    title: document.title,
    canvas: canvas ? { width: canvas.width, height: canvas.height } : null,
    menu: Boolean(menu),
    bodyText: document.body.innerText.slice(0, 600),
  };
})()`;
const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
console.log(JSON.stringify(result.result.value, null, 2));

const click = await send('Runtime.evaluate', {
  expression: `document.querySelector('.start-screen')?.click(); true`,
  returnByValue: true,
});
console.log(`start-clicked=${click.result.value}`);

await new Promise((resolve) => setTimeout(resolve, 1200));
const after = await send('Runtime.evaluate', {
  expression: `(() => ({
    pointerLocked: document.pointerLockElement !== null,
    hudText: document.body.innerText.slice(0, 600),
    canvas: Boolean(document.querySelector('canvas')),
  }))()`,
  returnByValue: true,
});
console.log(JSON.stringify(after.result.value, null, 2));
ws.close();
