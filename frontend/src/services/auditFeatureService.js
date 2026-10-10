import { auditCapabilityStatus } from './apiCapabilities.js';

/**
 * Audit feature endpoints are PLANNED in API_ENDPOINT_INVENTORY.md.
 * This service deliberately does not fabricate HTTP routes or successful results.
 */
export class PlannedCapabilityError extends Error {
  constructor(capability) { super(`${capability} is not connected: backend endpoint is planned or unverified.`); this.name = 'PlannedCapabilityError'; this.capability = capability; this.status = 'PLANNED'; }
}
export const auditFeatureService = Object.freeze({
  capabilityStatus: auditCapabilityStatus,
  async listEvidence() { throw new PlannedCapabilityError('Evidence management'); },
  async listFindings() { throw new PlannedCapabilityError('Findings'); },
  async listWorkpapers() { throw new PlannedCapabilityError('Workpapers'); },
  async getAuditTrail() { throw new PlannedCapabilityError('Audit trail'); },
  async getReconciliation() { throw new PlannedCapabilityError('Reconciliation'); },
  async getRelatedParties() { throw new PlannedCapabilityError('Related-party analysis'); },
});
