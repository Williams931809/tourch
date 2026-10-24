# Torch Bearers Academy — School Management Platform

Branded responsive school portal for Torch Bearers Academy, Benin City. Motto: **Always Ahead**.

## Current modules

- Four role-aware portals: administrator, teacher, student, parent
- Supabase Auth login and school-controlled invitations
- School setup, academic sessions, classes, subjects, teacher assignments, student enrollment, parent-to-child linking
- Lesson notes with browser dictation, text/PDF import, optional image OCR and AI summarization
- Question banks, teacher-approved exams, student submissions, objective auto-marking, teacher theory-marking
- Attendance, continuous assessment, report cards, announcements

## Run locally

```bash
npm install
npm run dev
npm run build
```

The default project reference is `kzlzrdqsotbttfsiumbc`. Override with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Only publishable keys go in the frontend.

## Database

The existing Supabase project already contains the initial 17 tables. The applied, version-controlled migrations are committed under `supabase/migrations/`. These are already deployed to the dedicated Supabase project; do not reapply them to that project. It adds RLS policies, secure RPC submissions/marking, and moves answer keys to a protected table. If a partial migration is present, reconcile migrations before retrying. Schema includes SQL `SECURITY DEFINER` helpers under unexposed `app_private` schema.

## Initial school administrator

No default admin email/password is bundled. In the Supabase dashboard, create a user in Auth → Users, then add a matching row to `profiles` with that user's Auth ID, `role='admin'`, and the `school_id` belonging to the Torch Bearers Academy record. This is a one-time privileged setup and should be done via secure dashboard access. Admins may then use the `school-invite` function (deploy it and configure email SMTP for production) to invite other users.

## Optional AI features

`supabase/functions/school-ai` requires a configured server-side provider credential `OPENAI_API_KEY`. Without it, OCR, summarization, and AI question generation display a clear error instead of fake results. Teacher approval is mandatory before publishing generated questions.

## Security & production-readiness

Treat as a **development build** until an administrator has been provisioned and all RLS, role isolation, school data access, exam timing, parent permissions, email invitations, grade calculation, service integrations and browser flows are tested end to end. Do not populate real student data before this testing. Use production SMTP, correct Auth URL redirect allowlist, monitoring, and backups.