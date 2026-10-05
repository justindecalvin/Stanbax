# Supabase Setup & Security Architecture

The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Without them it runs in local-only mode (localStorage) with zero external network dependencies.

## 1. Apply Database Schema & Security Migration

Supabase Dashboard → **SQL Editor** → New query → paste all of `supabase/schema.sql` (or `supabase/migrations/20261005_security_hardening.sql`) → **Run**.

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
- **Self-Only Password Protection**: `change_password` enforces that non-admin accounts can only change their own credentials and must supply the current password.
- **Offline / Graceful Fallback**: If Supabase is unconfigured or offline, the app operates gracefully with local storage fallbacks without unhandled promise rejections.
