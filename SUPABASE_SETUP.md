# Supabase Setup & Security Architecture

The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. With Supabase configured, Supabase is the shared school-data store and password authority. The app retains a sanitized browser cache for startup and responsive UI; passwords and security answers are not stored in that cache or the `school_state` table. Without these variables, the app runs in local-only mode and cannot sync between browsers.

## 1. Apply Database Schema & Security Migration

For a new project, use Supabase Dashboard → **SQL Editor** → New query, paste all of `supabase/schema.sql`, then **Run**.

For an existing project, run `supabase/migrations/20261008_cloud_password_self_change.sql` in the SQL Editor before deploying this app version. This updates the password RPC used by the app; editing the local SQL files does not change the live Supabase database.

### Hardened Database Components:
- **`user_roles`**: Isolated, non-user-editable RBAC table for strict role management.
- **`credentials`**: BCRYPT-hashed authentication credentials. Never readable by the browser (table revoked from `anon` and `authenticated`; direct access blocked). Mass-assignment prevention triggers block unauthorized role mutations.
- **`sessions`**: Cryptographically secure 32-byte tokens with automatic 12-hour expiration.
- **`school_state`**: State storage with **FORCED Row Level Security (RLS)** and granular per-operation policies (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
- **`audit_logs`**: Tamper-evident security trail logging authentication events, password updates, and policy violation attempts.
- **Security Definer Functions**: Every RPC has immutable `search_path = public, extensions, pg_temp` to prevent search-path injection attacks.

## 2. Environment Variables Configuration

Set environment variables in your deployment environment or `.env`:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public Anon key (`eyJ...`) — Safe for client bundle |

**Zero-Trust Rule**: The `service_role` secret key is NEVER exposed to the frontend, public environment variables, or client bundles.

## 3. Security & Access Control Enforcement

- **Granular Key Scoping**:
  - **Public (Anonymous)**: Hero slides, gallery, academic programs, calendar, FAQs, meal menu, etc.
  - **Admin / Proprietress**: Complete administrative authority over school configuration, credentials, staff assignments, academic broadsheets, bursary settings.
  - **Faculty / Tutors**: Classroom lesson notes, continuous assessments, CBT quizzes, class attendance, timetables, and homework assignments.
  - **Students**: CBT drill attempts, student articles, ephemeral statuses, and community chat.
  - **Parents**: Consultation requests, payment receipts, and ward inquiries.
- **Privilege Escalation Defense**: `create_credential` requires `public.is_admin()`. Unprivileged sessions attempting account creation or role escalation are blocked and logged.
- **Self-Only Password Protection**: `change_password` verifies the signed-in account's role and reference ID, and requires the current password for self-service changes. Administrators can reset other accounts.
- **Local cache**: School records are cached in the browser for the existing synchronous UI. Supabase remains the shared persisted store when configured. A cache is not a substitute for successful cloud writes.
- **Browser migration**: Administrators can use **Sync This Browser to Supabase** in School Settings to upload that browser's saved school records. The action overwrites matching cloud keys, skips browser-only/session fields and sensitive values, and requires confirmation. Ensure the intended browser is the source before running it.
- **Password recovery**: Security-question recovery is not configured for cloud mode. An administrator must reset passwords through the credentials page until a secure cloud recovery flow is implemented.
