# Mobile (Expo)

## Why `app/` and `src/`?

- **`app/`** — **Routes only.** Used by [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing. Each file here becomes a screen; the file path is the URL. Layouts use `_layout.tsx`; dynamic segments use `[id].tsx`. Keep this folder limited to route entry points and layouts.
- **`src/`** — **App logic.** Components, state (Auth, API, Offline), services, and styles live here. Routes in `app/` import from `src/` so that shared code stays in one place and isn’t tied to URL structure.

This keeps URLs and navigation in `app/` and reusable code in `src/`.

## Route → file mapping

| Route | File | Purpose |
|-------|------|--------|
| `/` | `app/index.tsx` | Root redirect (signed in → `/content`, else → `/sign-in`) |
| `/sign-in` | `app/sign-in.tsx` | Sign-in screen |
| `/content` | `app/content/index.tsx` | Content list |
| `/content/new-draft` | `app/content/new-draft.tsx` | New draft form |
| `/content/[id]` | `app/content/[id].tsx` | Content detail |
| `/content/[id]/edit` | `app/content/[id]/edit.tsx` | Edit draft form |
