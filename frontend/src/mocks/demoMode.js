export const DEMO_MODE = import.meta.env?.VITE_TRACE_DEMO_MODE === 'true';
export const DEMO_MODE_LABEL = 'DEMO MODE — illustrative synthetic data; not a live audit result.';
export function requireDemoMode() { if (!DEMO_MODE) throw new Error('This operation is available only in explicitly enabled demo mode.'); }
