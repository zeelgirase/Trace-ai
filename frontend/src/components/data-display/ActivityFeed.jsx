import React from 'react';
import Timeline from './Timeline.jsx';

export default function ActivityFeed({ events = [] }) {
  return <section className="trace-panel"><header className="trace-panel__header"><div><p className="trace-eyebrow">AUDIT LOG</p><h2>Recent activity</h2></div></header><Timeline items={events} /></section>;
}
