import { useState } from 'react';
export default function useLocalPreference(key, initialValue) {
  const [value, setValue] = useState(() => { try { const saved = globalThis.localStorage?.getItem(key); return saved === null || saved === undefined ? initialValue : JSON.parse(saved); } catch { return initialValue; } });
  const update = (next) => { setValue((current) => { const resolved = typeof next === 'function' ? next(current) : next; try { globalThis.localStorage?.setItem(key, JSON.stringify(resolved)); } catch { /* Storage may be disabled; state still works in memory. */ } return resolved; }); };
  return [value, update];
}
