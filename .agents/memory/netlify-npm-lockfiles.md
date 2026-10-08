---
name: Netlify npm lockfiles
description: Keep npm lockfiles portable between Replit and Netlify.
---

For Netlify deployments, the lockfile must not reference `package-firewall.replit.internal`; Netlify cannot resolve Replit's internal package host.

**Why:** Netlify dependency installation fails before the app build when npm follows those internal tarball URLs.

**How to apply:** Generate the lockfile against `https://registry.npmjs.org`, confirm no Replit firewall host remains, and verify with a clean install before deploying.
