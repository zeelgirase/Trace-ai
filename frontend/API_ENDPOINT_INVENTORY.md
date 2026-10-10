# TRACE frontend API endpoint inventory

The repository currently contains an empty frontend scaffold and no backend
source. The endpoint status below is therefore based on the three supplied API
documents, not a registered FastAPI route or a live OpenAPI schema. No route is
classified as `IMPLEMENTED`.

The browser API base is configured by `VITE_API_BASE_URL`, defaulting to
`http://localhost:8000/api/v1`. The health endpoint is rooted at the API
server origin (`/health`) rather than below `/api/v1`.

| Feature | Method | Path | Supporting source | Status | Frontend service |
|---|---|---|---|---|---|
| Health | GET | `/health` | API_DOCUMENTATION.md, API_QUICK_REFERENCE.md, WORKFLOW_GUIDE.md | DOCUMENTED | `healthService.check` |
| Authentication | POST | `/api/v1/auth/register` | All three documents | DOCUMENTED | `authService.register` |
| Authentication | POST | `/api/v1/auth/login` | All three documents | DOCUMENTED | `authService.login` |
| Authentication | GET | `/api/v1/auth/me` | All three documents | DOCUMENTED | `authService.getCurrentUser` |
| Engagements | POST | `/api/v1/engagements/` | All three documents | DOCUMENTED | `engagementService.create` |
| Engagements | GET | `/api/v1/engagements/` | All three documents | DOCUMENTED | `engagementService.list` |
| Engagements | GET | `/api/v1/engagements/{engagement_id}` | API_DOCUMENTATION.md, WORKFLOW_GUIDE.md | DOCUMENTED | `engagementService.getById` |
| Engagements | PATCH | `/api/v1/engagements/{engagement_id}` | API_DOCUMENTATION.md, WORKFLOW_GUIDE.md | DOCUMENTED | `engagementService.updateMetadata` |
| Uploads | POST | `/api/v1/uploads/{engagement_id}/upload` | All three documents | DOCUMENTED | `uploadService.uploadFile` |
| Uploads | GET | `/api/v1/uploads/{engagement_id}/uploads` | All three documents | DOCUMENTED | `uploadService.listUploads` |
| Validation | POST | `/api/v1/uploads/{engagement_id}/validate/{artifact_id}` | All three documents | DOCUMENTED | `uploadService.validateUpload` |

## Planned endpoint groups

The following registry groups are intentionally empty; no backend paths are
invented for them: users, organizations, dashboard, jobs, datasets, records,
submissions, ledger, reconciliation, related parties, counterparties,
duplicates, risk assessments, sampling, evidence, audit tests, anomalies,
investigations, findings, workpapers, reviews, sign-off, audit trail, integrity,
change impact, reports, exports, notifications, administration, agent
identities, MCP, and metadata. They remain `PLANNED` and the service layer does
not send calls for them.

The integration states and honest user-facing text are exposed from
`src/services/apiCapabilities.js` for future UI use. No workflow pages or
existing components were present to wire to that state.

## Contract discrepancies and limits

- The API documentation accepts `status` in an engagement `PATCH`, while the
  workflow guide shows status changes and says they follow workflow rules. No
  allowed transition matrix or dedicated status endpoint is specified. The
  frontend service therefore exposes metadata updates only (`name` and
  `description`) and will reject status changes rather than bypass workflow
  rules.
- The role code used for registration is documented as
  `INDEPENDENT_AI_AUDITOR`; parts of the authorization matrix call that role
  `AI_AUDITOR`. The frontend preserves the registration role code and does not
  silently alias the two.
- The documents disagree on whether registration `full_name` is mandatory;
  examples include it, while the integration example marks it optional. The
  frontend passes registration fields through without rewriting or omitting
  them.
- The docs list differing subsets of engagement statuses and inconsistent
  actor labels. The frontend treats returned status strings as server data and
  does not offer status-transition controls.
- Upload size is documented as 100 MB and backend-configurable. The frontend
  checks 100 MB and documented extensions as an early guard only; server
  validation remains authoritative.
- `GET /api/v1/engagements/` documents no query parameters. Query support is
  available generically in the client but is not attached to that endpoint.
- The described authentication API has no refresh-token or server-side logout
  endpoint. Logout only clears the locally stored bearer token.
- Fetch does not expose upload progress events. No upload-progress UI is
  present; progress reporting needs a deliberate transport/UI decision.

## Verification boundary

There is no backend directory, OpenAPI document, non-empty frontend source,
existing dependency manifest, or existing UI/test implementation in this
repository. Thus backend paths and schemas remain `DOCUMENTED`, not
`IMPLEMENTED`, and live integration has not been verified.
