import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export default function CurrencyValue({ value, currency = 'INR' }) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return <span>—</span>;
  return <span className="trace-numeric">{currency === 'INR' ? currencyFormatter.format(value) : new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value)}</span>;
}
