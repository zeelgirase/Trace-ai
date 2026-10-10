const PLANNED = 'PLANNED';

export const auditCapabilities = Object.freeze([
  ['dataset-ingestion-validation', 'Dataset ingestion and validation'],
  ['dataset-versioning-locking', 'Dataset versioning and explicit locking'],
  ['ledger-reconciliation', 'Ledger exploration and reconciliation'],
  ['related-party-analysis', 'Related-party analysis'],
  ['duplicate-detection', 'Duplicate detection'],
  ['risk-assessment', 'Risk assessment'],
  ['deterministic-sampling', 'Deterministic audit sampling'],
  ['sales-tod', 'Sales test of details'],
  ['cutoff-testing', 'Cut-off testing'],
  ['credit-note-testing', 'Credit-note testing'],
  ['evidence-management', 'Evidence management'],
  ['anomaly-investigation', 'Anomaly investigation'],
  ['findings-financial-impact', 'Findings and financial impact'],
  ['workpapers', 'Workpaper generation and version history'],
  ['human-review-approval', 'Human auditor review and approval'],
  ['final-signoff', 'Final sign-off'],
  ['audit-integrity', 'Audit event history and hash verification'],
  ['change-impact', 'Change-impact reassessment'],
  ['reports-exports', 'Report generation and export'],
  ['notifications', 'Notifications'],
  ['administration', 'Administrative management'],
  ['mcp-monitoring', 'MCP agent monitoring and integration'],
].map(([id, label]) =>
  Object.freeze({
    id,
    label,
    status: PLANNED,
    message: 'Unavailable: backend support is pending or not yet verified.',
  }),
));

export const auditCapabilityStatus = PLANNED;
