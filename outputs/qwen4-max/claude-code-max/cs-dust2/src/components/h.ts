import { createElement, Fragment } from 'react';
import type { ReactNode } from 'react';

// Hyperscript helper. The UI is authored with createElement (no JSX) so the
// whole codebase is plain TypeScript that can be type-checked and even run
// under Node's native type-stripping without a build step.
export const h = createElement;
export { Fragment };
export type { ReactNode };
