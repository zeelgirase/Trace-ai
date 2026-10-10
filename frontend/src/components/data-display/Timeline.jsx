import React from 'react';

export default function Timeline({ items = [] }) {
  if (!items.length) return <p className="trace-muted">No timeline events available.</p>;
  return <ol className="trace-timeline">{items.map((item) => <li className="trace-timeline__item" key={item.id}>
    <span className="trace-timeline__dot" aria-hidden="true" />
    <div><div className="trace-timeline__heading">{item.title}</div>{item.time ? <time className="trace-mono trace-muted">{item.time}</time> : null}{item.description ? <p className="trace-muted">{item.description}</p> : null}</div>
  </li>)}</ol>;
}
