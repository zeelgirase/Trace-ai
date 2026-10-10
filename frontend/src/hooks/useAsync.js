import { useCallback, useEffect, useState } from 'react';

export function useAsync(asyncFunction, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const run = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState((previous) => ({ ...previous, loading: false, error }));
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  useEffect(() => { let active = true; (async () => { try { const data = await asyncFunction(); if (active) setState({ data, loading: false, error: null }); } catch (error) { if (active) setState({ data: null, loading: false, error }); } })(); return () => { active = false; }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return { ...state, run };
}
