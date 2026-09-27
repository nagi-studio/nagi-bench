// Node module-resolution hook: redirect `three` to the headless stub.
export async function resolve(specifier, context, next) {
  if (specifier === 'three') return { url: new URL('./three.mjs', import.meta.url).href, shortCircuit: true };
  return next(specifier, context);
}
