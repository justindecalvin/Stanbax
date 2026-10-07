---
name: Cloud authentication requirement
description: Intended authentication behavior for the Netlify-hosted Stanbax Schools portal.
---
The user says Stanbax Schools is hosted on Netlify and connected to Supabase. Password changes must persist across browsers and devices, and login must verify cloud credentials rather than local storage.

**Why:** Shared school data syncs, but locally changed passwords do not.

**How to apply:** Treat Supabase as the authentication authority; do not permit local/default password fallback when cloud verification is unavailable.
