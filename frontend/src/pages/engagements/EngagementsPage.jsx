import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../components/data-display/DataTable.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import InlineError from '../../components/feedback/InlineError.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { engagementService } from '../../services/engagementService.js';

export default function EngagementsPage() {
 const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(null);
 const load=useCallback(async()=>{setLoading(true);setError(null);try{const result=await engagementService.list();setItems(Array.isArray(result)?result:[]);}catch(e){setError(e);}finally{setLoading(false);}},[]);
 useEffect(()=>{load();},[load]);
 const columns=[{key:'name',label:'Engagement'},{key:'client_name',label:'Client'},{key:'reporting_period_start',label:'Period start'},{key:'reporting_period_end',label:'Period end'},{key:'status',label:'Status'},{key:'updated_at',label:'Last updated'}];
 return <main className="trace-page"><header className="trace-page__header"><div><p className="trace-eyebrow">WORKSPACE</p><h1>Engagements</h1><p className="trace-muted">Engagements returned by the configured API.</p></div><button className="trace-button trace-button--secondary" onClick={load}>Refresh</button></header>{loading?<LoadingState label="Loading engagements…"/>:error?<InlineError title="Could not load engagements" message={error.message} onRetry={load}/>:items.length===0?<EmptyState title="No engagements returned" description="Create an engagement through the supported workflow or verify your API connection."/>:<section className="trace-panel"><DataTable columns={columns} rows={items} getRowKey={(row)=>row.id}/></section>}</main>;
}
