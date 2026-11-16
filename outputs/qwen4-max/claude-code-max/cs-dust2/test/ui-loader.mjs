// Test-only loader: substitutes a minimal React stub so UI component bodies can
// be executed headlessly against real engine snapshots (no npm deps required).
const REACT_STUB = `
export const Fragment = Symbol.for('fragment');
export function createElement(type, props, ...children) {
  return { __el: true, type, props: props || {}, children: children.flat(Infinity) };
}
export function useState(init) { return [typeof init === 'function' ? init() : init, () => {}]; }
export function useRef(init) { return { current: init }; }
export function useEffect() {}
export function useLayoutEffect() {}
export function useMemo(fn) { return fn(); }
export function useCallback(fn) { return fn; }
export function useSyncExternalStore(sub, get) { return get(); }
export default { createElement, Fragment, useState, useRef, useEffect, useMemo, useCallback, useSyncExternalStore };
`;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'react') return { url: 'stub:react', shortCircuit: true };
  if (specifier === 'react-dom/client') return { url: 'stub:react-dom', shortCircuit: true };
  if (specifier === 'three') return { url: new URL('./three-stub.mjs', import.meta.url).href, shortCircuit: true };
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === 'stub:react') return { format: 'module', source: REACT_STUB, shortCircuit: true };
  if (url === 'stub:react-dom') return { format: 'module', source: 'export function createRoot(){ return { render(){} }; }', shortCircuit: true };
  return nextLoad(url, context);
}
