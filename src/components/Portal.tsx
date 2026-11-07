import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

/** Renders full-screen overlays on <body> so animated parents can't clip them. */
export function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
