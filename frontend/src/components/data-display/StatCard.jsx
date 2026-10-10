import React from 'react';

export default function StatCard({ label, value, detail, tone = 'default' }) {
  return (
    <section className={`trace-stat-card trace-stat-card--${tone}`} aria-label={label}>
      <p className="trace-eyebrow">{label}</p>
      <p className="trace-stat-card__value">{value}</p>
      {detail ? <p className="trace-stat-card__detail">{detail}</p> : null}
    </section>
  );
}
