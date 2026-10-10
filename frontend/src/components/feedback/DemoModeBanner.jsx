import React from 'react';
export default function DemoModeBanner({ children = 'DEMO MODE — illustrative synthetic data; not connected to a verified audit endpoint.' }) { return <aside className="trace-demo-banner" role="note"><strong>DEMO</strong><span>{children}</span></aside>; }
