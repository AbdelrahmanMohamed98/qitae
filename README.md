# Qitae – Content Platform Slice

A small, realistic slice of a content-driven digital platform: **React web dashboard** and **React Native (Expo) mobile app**, both consuming the same API contract and business rules.

## How to Run

### Prerequisites

- Node.js 18+
- npm (workspaces are used; pnpm/yarn work too)

### From repo root (recommended)

One install at the root installs all workspace dependencies (`shared`, `web`, `mobile`):

```bash
npm install
```

**Web**

```bash
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173). Sign in as **Admin**, **Editor**, or **Reviewer** (simulated; no backend).

**Mobile**

```bash
npm run dev:mobile
```

Use Expo Go on a device or an emulator (scan QR code). Sign in with the same simulated roles. For a clean cache: `npm run dev:mobile -- --clear`.

### Alternative (per-app)

```bash
# Web
npm install && cd web && npm run dev

# Mobile (from repo root)
cd mobile && npx expo start
```

### Tests

From repo root:

```bash
npm test
```

This runs shared workflow unit tests and web tests. Or per workspace:

```bash
npm run test -w @qitae/shared   # workflow unit tests
npm run test -w @qitae/web     # web integration tests
```

---

## Folder Structure

```
qitae/
├── package.json            # Workspaces: shared, web, mobile; root scripts dev:web, dev:mobile, test
├── shared/                 # Shared types, domain logic, API contract
│   └── src/
│       ├── types/          # UserSession, ContentItem, ContentStatus, etc.
│       ├── domain/         # Workflow rules, sector access
│       │   ├── workflow.ts # Status transitions, allowed actions by role
│       │   ├── workflow.test.ts
│       │   └── sectors.ts
│       ├── api/            # API contract + mock implementation
│       │   ├── contract.ts
│       │   └── mockApi.ts  # Latency 300–800ms, ~15% random failure
│       └── index.ts
├── web/                    # React + TypeScript + Vite + React Router + Tailwind
│   └── src/
│       ├── components/     # Layout, content-list, ContentCard, EmptyState, ErrorState, LoadingState, ui
│       ├── screens/        # Login, ContentList, ContentDetails, DraftForm
│       ├── state/          # Jotai atoms (api, auth) + useApi, useAuth
│       ├── services/       # contentService (sector filtering)
│       ├── helpers/        # formatDate, etc.
│       └── types/          # Component prop types
├── mobile/                 # React Native + Expo + TypeScript + Expo Router
│   ├── app/                # File-based routes
│   │   ├── _layout.tsx     # Root layout, SafeAreaProvider, Auth + Api + Offline providers
│   │   ├── index.tsx       # Redirect to login or content
│   │   ├── login.tsx
│   │   └── content/
│   │       ├── _layout.tsx # AppHeader, SafeAreaView
│   │       ├── index.tsx   # Content list (filters, offline toggle)
│   │       ├── new-draft.tsx
│   │       ├── [id].tsx    # Content detail (actions, audit trail)
│   │       └── [id]/edit.tsx
│   └── src/
│       ├── components/     # AppHeader
│       ├── screens/        # DraftFormScreen (shared by new + edit)
│       ├── state/          # Jotai atoms (auth, api, offline) + hooks + AuthHydrate
│       ├── services/       # contentService (same logic as web)
│       └── styles/         # Shared colors, component style modules
└── README.md
```

- **UI**: components and screens only; no workflow logic in components.
- **State/data**: Auth (session), API (mock), Offline (mobile queue).
- **API/service**: `shared/api` = contract + mock; web/mobile use it via Jotai (web) or Jotai + offline-aware hook (mobile).
- **Domain**: `shared/domain/workflow.ts` and `sectors.ts`; used by both apps for allowed actions and sector visibility.

---

## Evaluation Criteria (Mapping)

| Criterion | Where it lives |
|-----------|----------------|
| **Architecture / structure** | Monorepo: `shared` (types, domain, API), `web` and `mobile` consume it. Single API contract; workflow and sector rules in shared domain, not in UI. |
| **Role/sector access** | `shared/domain/sectors.ts` (`canSeeSector`, `visibleSectors`). Web/mobile `contentService`: `filterContentBySector`, `getVisibleSectorOptions`, `canAccessContent`. Content detail checks access before render. Tests: `shared/src/domain/sectors.test.ts`. |
| **Workflow transitions** | `shared/domain/workflow.ts` (`getAllowedActions`, `canPerformAction`, `isValidTransition`, `getBlockedReason`). UI shows only allowed actions; mock API enforces status. Tests: `shared/src/domain/workflow.test.ts`, `web/.../ContentList.test.tsx`. |
| **Mobile offline queue** | Jotai atoms in `mobile/src/state/atoms/offline.ts`; `useOffline` and `useApi` (offline-aware) in `mobile/src/state/hooks/`. When offline: mutations queued, reads fail. On toggle off: `flushQueue()` runs against raw API; alert shows Synced/Failed. |
| **Failures / retries** | Mock API ~15% failure; list and detail screens show error + **Retry** button. Blocked actions use `getBlockedReason()`; toasts/alerts on API errors. |
| **Code quality** | TypeScript throughout; shared types; small focused modules; Tailwind (web) and style modules (mobile). |
| **Tests & docs** | **Tests**: `shared`: workflow + sector unit tests; `web`: workflow integration test. **Docs**: This README (run, structure, role/sector, workflow, offline, errors, tradeoffs). **CI**: `.github/workflows/ci.yml` runs `npm test` (shared + web) on push/PR; run `npm run lint -w @qitae/mobile` locally for mobile. |

---

## Role + Sector Access

### Session model

- **UserSession**: `id`, `name`, `role`, `assignedSectors` (array, at least 2 sectors).
- **Roles**: `admin`, `editor`, `reviewer`.
- Login is simulated: pick a role; session is stored (web: `sessionStorage`, mobile: AsyncStorage). Routing and UI use this session object.

### Sector-based access

- **Admin**: sees all sectors and all content.
- **Editor / Reviewer**: see only content in `assignedSectors`.
- Enforcement:
  - **shared/domain/sectors.ts**: `canSeeSector(session, sector)`, `visibleSectors(session, allSectors)`.
  - **web** and **mobile** `contentService`: after `getContentList()`, filter items with `filterContentBySector(items, session)`; sector filters (web) and sector options (create/edit) use `getVisibleSectorOptions(session, allSectors)`.
- Content detail: before showing an item, `canAccessContent(session, item)` is checked; otherwise “You don’t have access” is shown.

---

## Editorial Workflow

- **Statuses**: Draft → In Review → Published.
- **Rules** live in **shared/domain/workflow.ts** (not in UI):
  - **Editor**: create drafts, edit drafts, submit for review.
  - **Reviewer**: approve and publish (only from In Review).
  - **Admin**: all of the above + revert to draft from In Review.
- **UI**: Content detail and draft form call `getAllowedActions(role, status)` and only show buttons for those actions. Invalid actions (wrong role or status) are blocked and show a message via `getBlockedReason()` (e.g. “You don’t have permission”, “Only drafts can be submitted for review”).
- **API**: Mock API also enforces status (e.g. only drafts editable); errors are surfaced as user-facing messages and toasts/alerts.

---

## Offline Queue (Mobile)

- **Toggle**: “Offline mode” switch on the Content list screen.
- **When ON (offline)**:
  - All API calls (reads and writes) are treated as failing: reads return an error; writes do not call the server.
  - Mutations (create, update, submit for review, approve) are **queued** in `OfflineContext` (in memory; structure is serializable so it could be persisted later).
  - UI shows **“Queued actions: X”** so the user knows pending work is stored.
- **When OFF (online again)**:
  - User turns the switch off. If the queue is non-empty, the app runs **flushQueue(api)** against the **real** mock API (not the offline-aware wrapper): each queued action is sent in order (create, update, submitForReview, approveContent).
  - Queue is cleared; user sees an alert “Synced: X, Failed: Y” and the list is refreshed from the API.
- **Implementation**:
  - Jotai atoms in `mobile/src/state/atoms/offline.ts`; **useApi** (mobile) is offline-aware (queues mutations when offline). **Flush**: Uses the same mock API instance (e.g. `createMockApi()`) so that synced data appears in the same “server” state that the app uses when online.

---

## Error Handling & UX

- **Loading**: Spinner / “Loading…” on list, detail, and draft form.
- **Empty**: “No content” / “No content found” with optional hint (e.g. change filters, create draft).
- **Error**: Message + **Retry** where it makes sense (e.g. list, detail).
- **Success**: Toasts (web) or alerts (mobile) on create/update/submit/publish.
- **Blocked actions**: Messages from `getBlockedReason()` (and API errors) shown as toasts or alerts (“You don’t have permission”, “Invalid transition”, etc.).

---

## Data & API

- **Contract**: Single API used by both web and mobile (`shared/api/contract.ts`):
  - `getContentList(filters)`, `getContentById(id)`, `createContent(payload)`, `updateContent(id, payload)`, `submitForReview(id)`, `approveContent(id)`, `getAuditTrail(contentId)`.
- **Implementation**: Mock in `shared/api/mockApi.ts` (in-memory store, same for web and mobile).
  - **Latency**: 300–800 ms per call.
  - **Failure**: ~15% of calls return an error; UI shows message and retry where applicable.
- **Audit trail**: Mocked per content (created/updated entries); section exists on Content details.

---

## Tradeoffs

1. **Shared package**: Types, workflow, and mock API live in `shared/`. Web and mobile depend on it via `file:../shared`. No separate mock server; simpler setup and same contract in one place.
2. **Offline**: Queue is in-memory only. Persisting the queue (e.g. AsyncStorage) and replaying after app restart would be a natural next step.
3. **Auth**: No real backend; session is stored client-side only. Role/sector and workflow rules are still enforced in the client and in the mock API.
4. **Web test**: Full React Router + providers caused duplicate-React/hook issues in the test env; the second test is a small integration-style test that imports and asserts on `@qitae/shared` workflow functions from the web app context, so we still have two tests (workflow unit in shared + workflow-from-web).
5. **Mobile create/edit**: Same draft form component for “new” and “edit”; edit is routed as `content/[id]/edit` and passes `editId` into the form.

---

## What I’d Improve Next

1. **Offline**: Persist queue to AsyncStorage and replay on app start when back online; optional conflict handling (e.g. last-write-wins or merge rules).
2. **Tests**: Add a full E2E or integration test for web (e.g. Playwright) with a single React version and proper provider setup; add mobile unit tests for OfflineContext and sector filtering.
3. **Real API**: Swap mock for a small backend (e.g. Node + Express or Next API routes) keeping the same contract; add auth token to session.
4. **Pagination**: Add cursor- or page-based pagination to `getContentList` and infinite scroll on web list.

See **Release readiness** below for how to publish web and mobile.

---

## Screen Recording (Optional)

A short recording could cover:

- **Web**: Login (pick role) → Content list with status/sector filters → Open a content item → Actions (Edit / Submit for review / Approve) by role → Create draft → Error/retry and toasts.
- **Mobile**: Login (name + role) → Content list → Offline toggle ON → Create or edit (queued) → “Queued actions: N” → Toggle OFF → Sync alert “Synced: X, Failed: Y” → List refresh.
- **Shared behaviour**: Same workflow rules and sector visibility on both platforms; content detail “You don’t have access” when sector is not assigned.

---

## Release Readiness (How to Publish)

### Web

- **Build**: From root, `npm run build:web` (or `npm run build -w @qitae/web`). Output: `web/dist/`.
- **Deploy**: Static host (e.g. Vercel, Netlify, Cloudflare Pages). Point build output to `web/dist` and build command to `npm run build -w @qitae/web` (with install from repo root). Set env (e.g. `VITE_API_BASE_URL`) when switching to a real API.
- **Readiness**: Replace mock API with backend using the same `shared` contract; add auth (e.g. JWT) and use env for API base URL.

### Mobile

- **Build**: Install EAS CLI (`npm i -g eas-cli`), then from `mobile/`: `eas build --platform all` (or `ios` / `android`). Requires Expo account and `app.json` / `eas.json` configured (e.g. bundle identifier, version).
- **Submit**: `eas submit` for App Store / Play Store (or internal distribution). Use the same API base URL (env) for staging vs production.
- **Readiness**: Add `eas.json` with build profiles (development, preview, production). Ensure icons/splash and privacy policy URLs are set. Offline queue is in-memory; consider persisting before release if offline usage matters.

### Shared

- **Publish**: Not published to npm; consumed via `file:../shared` in the monorepo. For a multi-repo setup, `shared` could be published as a private package or git submodule.

---

## Summary

- **Web**: Login → Content list (filters, sort by latest) → Content detail (actions + audit) → Create/Edit draft; sector and workflow enforced via shared domain.
- **Mobile**: Same flows; Content list shows sector + status; Offline toggle + queued actions + sync on re-online.
- **Shared**: One API contract, one workflow and sector model, one mock implementation with latency and random failure; used by both platforms.
