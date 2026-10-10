import React from 'react';

export default function DataTable({ columns, rows, getRowKey, emptyMessage = 'No records to display.', onRowClick }) {
  if (!Array.isArray(columns) || !Array.isArray(rows)) throw new TypeError('DataTable expects columns and rows arrays.');
  return (
    <div className="trace-table-wrap">
      <table className="trace-table">
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={columns.length} className="trace-table__empty">{emptyMessage}</td></tr> : rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row) : row.id ?? index} onClick={onRowClick ? () => onRowClick(row) : undefined} className={onRowClick ? 'trace-table__row--interactive' : undefined}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : (row[column.key] ?? '—')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
