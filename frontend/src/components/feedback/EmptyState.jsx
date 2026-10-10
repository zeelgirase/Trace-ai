import React from 'react';
export default function EmptyState({ title = 'Nothing here yet', description, action }) { return <div className="trace-empty"><span className="trace-empty__mark" aria-hidden="true">—</span><h3>{title}</h3>{description ? <p>{description}</p> : null}{action}</div>; }
