---
name: Cloud authentication requirement
description: Intended authentication behavior for the Netlify-hosted Stanbax Schools portal.
---
The user says Stanbax Schools is hosted on Netlify and connected to Supabase. Password changes must persist across browsers and devices, and login must verify cloud credentials rather than local storage.

The user also wants all permanent school data shared through Supabase, with an admin School Settings action for migrating a browser's locally cached records. Keep only a sanitized cache in the browser; exclude passwords, security answers, and browser/session markers from shared data.

**Why:** Shared school data syncs, but locally changed passwords do not.

**How to apply:** Treat Supabase as the authentication authority and shared persistent store; do not permit local/default password fallback when cloud verification is unavailable. Migration from a browser must be explicit, admin-authorized, and warn before replacing matching cloud records.
