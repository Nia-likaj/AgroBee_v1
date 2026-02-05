# AgroBee — Next.js + Firebase scaffold

This folder contains a minimal scaffold for the Next.js App Router architecture with Firebase-backed services.

- `app/` — App Router routes (public, protected, admin stubs)
- `components/` — UI components (stubs)
- `services/` — Firestore service stubs (Farms, Posts, Favorites, Users)
- `lib/firebase.ts` — Firebase client init helper
- `types/` — TypeScript domain models
- `firestore.rules` — Example Firestore security rules (RBAC)

Next steps:

1. Install Next.js/React/TypeScript and Firebase packages.
2. Implement the `services/*` methods to query Firestore using `lib/firebase`.
3. Add client auth guards and server-side token verification for protected actions.
4. Configure environment variables on local and Vercel.
