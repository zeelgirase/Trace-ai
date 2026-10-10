import React from 'react';
export default function LoadingState({ label = 'Loading data…' }) { return <div className="trace-state" role="status"><span className="trace-spinner" aria-hidden="true" />{label}</div>; }
