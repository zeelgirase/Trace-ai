import React, { useState } from 'react';
import { AuditOverviewPage, EngagementsPage, EvidencePage, FindingsPage, WorkpapersPage, SettingsPage } from './features/audit-workspace/index.js';
import './styles/index.css';

const NAV = [
 { label: 'Workspace', items: [{ id: 'overview', label: 'Audit overview', icon: '◫' }, { id: 'engagements', label: 'Engagements', icon: '▤' }] },
 { label: 'Audit procedures', items: [{ id: 'evidence', label: 'Evidence collection', icon: '↗' }, { id: 'findings', label: 'Findings', icon: '◎' }, { id: 'workpapers', label: 'Workpapers', icon: '▧' }] },
 { label: 'Administration', items: [{ id: 'settings', label: 'Settings', icon: '⚙' }] }
];
const PAGES = { overview: AuditOverviewPage, engagements: EngagementsPage, evidence: EvidencePage, findings: FindingsPage, workpapers: WorkpapersPage, settings: SettingsPage };
export default function App() {
 const [active, setActive] = useState('overview');
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const Page = PAGES[active] || AuditOverviewPage;
 const activeLabel = NAV.flatMap(group => group.items).find(item => item.id === active)?.label || 'Audit overview';
 return <div className="trace-app">
  <aside className={`trace-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
   <button className="trace-brand" onClick={() => { setActive('overview'); setSidebarOpen(false); }} aria-label="TRACE home"><span className="trace-brand-mark">T</span><span><strong>TRACE</strong><small>REVENUE ASSURANCE</small></span></button>
   <div className="trace-workspace-switch"><span className="trace-workspace-dot"/><span><small>ACTIVE WORKSPACE</small><strong>FY 2025–26 · Revenue</strong></span><span className="trace-chevron">⌄</span></div>
   <nav aria-label="Main navigation">{NAV.map(group => <section className="trace-nav-group" key={group.label}><p>{group.label}</p>{group.items.map(item => <button key={item.id} className={`trace-nav-item ${active === item.id ? 'is-active' : ''}`} onClick={() => { setActive(item.id); setSidebarOpen(false); }}><span className="trace-nav-icon">{item.icon}</span>{item.label}{active === item.id && <span className="trace-nav-indicator"/>}</button>)}</section>)}</nav>
   <div className="trace-sidebar-bottom"><div className="trace-support-card"><span className="trace-support-icon">✳</span><strong>Audit with confidence.</strong><p>Evidence-led. Reviewable. Traceable.</p></div><button className="trace-user"><span className="trace-avatar">ZA</span><span><strong>Audit workspace</strong><small>Demo environment</small></span><span className="trace-chevron">···</span></button></div>
  </aside>
  {sidebarOpen && <button className="trace-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}
  <div className="trace-main"><header className="trace-topbar"><button className="trace-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">☰</button><div className="trace-breadcrumb"><span>TRACE</span><span className="trace-breadcrumb-slash">/</span><strong>{activeLabel}</strong></div><div className="trace-topbar-right"><span className="trace-env"><i/> DEMO DATA</span><button className="trace-icon-button" aria-label="Notifications" title="Notifications">♧<i/></button><span className="trace-topbar-divider"/><span className="trace-topbar-date">FY 2025–26</span></div></header><div className="trace-content"><Page /></div><footer className="trace-footer"><span>TRACE <span className="trace-footer-dot">·</span> Revenue assurance workspace</span><span>Illustrative data is labelled. No audit conclusion is implied.</span></footer></div>
 </div>;
}
