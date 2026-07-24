export function resolve(specifier, context, nextResolve) {
  if (specifier === 'three') {
    return {
      url: new URL('./three.mjs', import.meta.url).href,
      shortCircuit: true,
      format: 'module',
    };
  }
  return nextResolve(specifier, context);
}
