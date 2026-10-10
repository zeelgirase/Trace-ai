import React, { useMemo, useState } from 'react';
import StatCard from '../../components/data-display/StatCard.jsx';
import DataTable from '../../components/data-display/DataTable.jsx';
import DemoModeBanner from '../../components/feedback/DemoModeBanner.jsx';
import { demoSalesRegister } from '../../mocks/fixtures/demoSalesRegister.js';
import CurrencyValue from '../../components/data-display/CurrencyValue.jsx';

export default function AuditOverviewPage() {
 const [query, setQuery] = useState('');
 const rows = useMemo(() => demoSalesRegister.filter((row) => [row.invoice_number,row.counterparty,row.status].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
 const columns = [{key:'invoice_number',label:'Invoice reference'}, {key:'date',label:'Date'}, {key:'counterparty',label:'Counterparty'}, {key:'amount',label:'Net amount',render:(value)=><CurrencyValue value={value}/>}, {key:'status',label:'Review state'}, {key:'risk',label:'Risk'}];
 return <main className="trace-page"><DemoModeBanner /><header className="trace-page__header"><div><p className="trace-eyebrow">REVENUE ASSURANCE / OVERVIEW</p><h1>Audit overview</h1><p className="trace-muted">Investigate revenue, reconcile records, and document review decisions.</p></div><span className="trace-status">Synthetic workspace</span></header>
 <section className="trace-stat-grid"><StatCard label="Transactions in sample" value="5" detail="Synthetic demo records"/><StatCard label="Review candidates" value="3" detail="Illustrative only" tone="warning"/><StatCard label="Potential value under review" value="₹13.25L" detail="Not an assessed misstatement"/><StatCard label="Audit state" value="In progress" detail="No approval implied"/></section>
 <section className="trace-panel"><div className="trace-panel__header"><div><p className="trace-eyebrow">POPULATION EXPLORER</p><h2>Sales register</h2></div><label className="trace-search"><span className="trace-sr-only">Search sales register</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search invoice, counterparty…" /></label></div><DataTable columns={columns} rows={rows} getRowKey={(row)=>row.id} emptyMessage="No synthetic records match this search."/></section>
 <section className="trace-panel"><p className="trace-eyebrow">WORKFLOW</p><h2>Recommended next steps</h2><ol className="trace-step-list"><li><strong>Validate source population</strong><span>Use the engagement upload and validation workflow.</span></li><li><strong>Reconcile source to ledger</strong><span>Reconciliation endpoint is not yet verified.</span></li><li><strong>Review evidence and exceptions</strong><span>Capture findings only after sufficient evidence is available.</span></li></ol></section>
 </main>;
}
