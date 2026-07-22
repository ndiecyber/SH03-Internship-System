# LEXA Internship Management System - Project Continuation Guide

## Project Overview

- **Stack:** Next.js 15, TypeScript 5.7, PostgreSQL/Supabase, Prisma ORM, NextAuth 5 (JWT).
- **Repository:** `ndiecyber/SH03-Internship-System` (`main`).
- **Local URL:** `http://localhost:3000`.
- **Roles:** `ADMIN`, `INTERN`, `MENTOR`.

## Current Session Status — 2026-07-22

### Newly Completed: Selection, Intern Profile, and Google Drive Tracking

1. **Structured application workflow**
   - `Application.status` is now an `ApplicationStatus` enum: `PENDING`, `IN_REVIEW`, `INTERVIEW`, `ACCEPTED`, `REJECTED`, and `WITHDRAWN`.
   - Existing application data was migrated safely: `approved` to `ACCEPTED`, `rejected` to `REJECTED`, `review` to `IN_REVIEW`, and remaining values to `PENDING`.
   - Admin can add a selection session from `/admin/applicants`; applicant details display the session history.

2. **Selection sessions**
   - New `SelectionSession` model is related to an `Application` and optionally to the admin/interviewer.
   - It stores title, type, schedule, online/offline method, location or meeting link, interviewer, notes, score, result notes, and status.
   - Supported types: Administration, Interview, Technical Test, HR Interview, Final Interview, and Other.
   - Supported statuses: Scheduled, Completed, Cancelled, and Rescheduled.

3. **Accepted applicant becomes an Intern without duplicate accounts**
   - Admin acceptance now asks for confirmation.
   - The existing applicant `User` is updated to `role: INTERN` and `approvalStatus: APPROVED`; no new account is created.
   - If the intern has no mentor assignment, the first approved mentor is assigned when available.
   - Application history remains stored and access to Intern features follows the existing role guards.

4. **Expanded Intern profile**
   - `/intern/profile` now includes Personal Information, Education, Skill & Portfolio, and read-only Internship Information sections.
   - Intern-editable information includes contact, address, education, portfolio/LinkedIn, GitHub username, skills, bio, organization experience, and work/project experience.
   - Administrative internship fields remain Admin-controlled.
   - A profile-completion percentage helps Interns identify incomplete information.

5. **Google Drive registration tracking**
   - Intern records now track Google Drive registration status, folder URL, folder ID, registration timestamp, and the admin ID that recorded it.
   - `/admin/interns` has a Google Drive status column and filter.
   - New route: `/admin/google-drive-interns`, listing Interns whose Google Drive status is not yet registered.
   - Admin can register an Intern by saving the Google Drive folder URL and optional folder ID. This is intentionally internal tracking only; no Google Drive API credentials are needed.

### Existing Features

- Registration approval workflow (`PENDING`, `APPROVED`, `REJECTED`).
- Role-based middleware and route guards.
- Session persistence: 7-day JWT session, 24-hour server refresh, 5-minute client session refresh.
- Admin, Intern, and Mentor dashboards; internship program registration; logbooks; evaluations; certificates; announcements; and mentor assignments.
- Existing dashboard/user-list polling pattern for real-time updates.

## Routes

### Admin

- `/admin/dashboard`
- `/admin/applicants` — application review and selection sessions
- `/admin/interns` — intern list, mentor assignment, and Google Drive filter
- `/admin/google-drive-interns` — Interns not yet recorded in Google Drive
- `/admin/mentors`
- `/admin/internship-programs`
- `/admin/monitoring`
- `/admin/reports`
- `/admin/announcements`
- `/admin/settings`

### Intern

- `/intern/dashboard`
- `/intern/internship-registration`
- `/intern/logbook`
- `/intern/progress`
- `/intern/certificate`
- `/intern/announcements`
- `/intern/profile`

### Mentor

- `/mentor/dashboard`
- `/mentor/assigned-interns`
- `/mentor/logbook-review`
- `/mentor/evaluation`
- `/mentor/announcements`
- `/mentor/profile`

## Database Status

Key models include `User`, `Application`, `SelectionSession`, `InternshipProgram`, `MentorIntern`, `Logbook`, `Evaluation`, `Certificate`, and `Announcement`.

Applied migrations:

- `20260702051631_init`
- `20260702084439_extend_schema`
- `20260707120641_add_registration_approval`
- `20260722100000_application_selection_and_intern_profile` — applied successfully to Supabase on 2026-07-22.

Important schema files:

- `prisma/schema.prisma`
- `prisma/migrations/20260722100000_application_selection_and_intern_profile/migration.sql`

## Key Implementation Files

- `src/features/admin/services/applicant.actions.ts` — application statuses and selection-session actions.
- `src/features/admin/components/applicant-manager.tsx` — applicant review, selection form, and history.
- `src/features/admin/services/user-management.actions.ts` — intern list queries, mentor assignment, and Google Drive registration action.
- `src/features/admin/components/google-drive-interns.tsx` — Google Drive registration UI.
- `src/features/profile/services/profile.actions.ts` — intern profile reads and updates.
- `src/features/profile/components/profile-form.tsx` — expanded profile sections.
- `src/lib/navigation/role-navigation.ts` — Admin Google Drive navigation item.

## Verification Performed

- `npx prisma generate` — passed.
- `npx prisma migrate deploy` — passed; latest migration applied.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed.

The production build still emits the known non-blocking dynamic-server-usage messages for protected routes, because authentication reads request headers during static-generation analysis.

## How to Continue

```bash
npm run dev
npx prisma migrate deploy
npm run build
```

Use `npx prisma migrate deploy` for existing environments. Do not run `prisma migrate reset` except on a disposable development database.

## Recommended Manual Tests

1. Register an Intern, approve the account, create an application, add a selection session, then accept the application.
2. Confirm the same account can access Intern routes and appears in Admin Interns.
3. Complete the Intern profile and verify the completion percentage changes.
4. In Admin Interns, filter `Google Drive: Belum`; register a Drive folder; confirm the Intern disappears from `/admin/google-drive-interns`.
5. Verify mentor assignment and existing logbook, evaluation, certificate, and session-persistence flows still work.

## Possible Next Enhancements

- UI controls for editing/completing/rescheduling individual selection sessions and recording final scores/results.
- Admin profile-detail page and Admin-only editing of internship placement fields.
- Google Drive API integration to create folders automatically after credentials are configured.
- Email notifications for selection-session scheduling and rescheduling.
- WebSocket-based real-time updates, comments/feedback, certificate PDF generation, and progress analytics.

**Last Updated:** 2026-07-22
**Session Status:** Core selection, intern-profile, and Google Drive tracking features are implemented and verified.
