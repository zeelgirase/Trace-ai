# TRACE — Unified Frontend

This bundle combines the current audit workspace with a landing page and a clearly labelled local demo sign-in flow.

## Run locally

1. Extract this project.
2. Open a terminal in `Trace-ai-main/frontend`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Important demo limitations

- The landing page is a frontend experience.
- Sign-in is simulated locally: any non-empty email/password pair enters the workspace.
- Audit dashboard records are synthetic and labelled as demo data.
- Backend authentication and all audit actions are not automatically connected by this bundle.
- Keep the backend API contracts and environment configuration from your own project when integrating API functionality.

## Build

Run `npm run build` to test the production bundle.
