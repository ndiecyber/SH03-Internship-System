-- Add structured application and selection workflow without removing existing data.
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "SelectionSessionType" AS ENUM ('ADMINISTRATION', 'INTERVIEW', 'TECHNICAL_TEST', 'HR_INTERVIEW', 'FINAL_INTERVIEW', 'OTHER');
CREATE TYPE "SelectionSessionStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE "SelectionMethod" AS ENUM ('ONLINE', 'OFFLINE');

ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING (
  CASE "status"
    WHEN 'approved' THEN 'ACCEPTED'::"ApplicationStatus"
    WHEN 'rejected' THEN 'REJECTED'::"ApplicationStatus"
    WHEN 'review' THEN 'IN_REVIEW'::"ApplicationStatus"
    WHEN 'interview' THEN 'INTERVIEW'::"ApplicationStatus"
    WHEN 'withdrawn' THEN 'WITHDRAWN'::"ApplicationStatus"
    ELSE 'PENDING'::"ApplicationStatus"
  END
);
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "User"
  ADD COLUMN "nickname" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "gender" TEXT,
  ADD COLUMN "birthPlace" TEXT,
  ADD COLUMN "birthDate" TIMESTAMP(3),
  ADD COLUMN "address" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "province" TEXT,
  ADD COLUMN "institution" TEXT,
  ADD COLUMN "faculty" TEXT,
  ADD COLUMN "studyProgram" TEXT,
  ADD COLUMN "studentId" TEXT,
  ADD COLUMN "semester" INTEGER,
  ADD COLUMN "entryYear" INTEGER,
  ADD COLUMN "graduationYear" INTEGER,
  ADD COLUMN "portfolioUrl" TEXT,
  ADD COLUMN "linkedinUrl" TEXT,
  ADD COLUMN "skills" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "organizationExperience" TEXT,
  ADD COLUMN "workExperience" TEXT,
  ADD COLUMN "internshipStartDate" TIMESTAMP(3),
  ADD COLUMN "internshipEndDate" TIMESTAMP(3),
  ADD COLUMN "internshipPosition" TEXT,
  ADD COLUMN "internshipStatus" TEXT DEFAULT 'NOT_STARTED',
  ADD COLUMN "supervisorName" TEXT,
  ADD COLUMN "documentStatus" TEXT DEFAULT 'INCOMPLETE',
  ADD COLUMN "googleDriveRegistered" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "googleDriveFolderUrl" TEXT,
  ADD COLUMN "googleDriveFolderId" TEXT,
  ADD COLUMN "googleDriveRegisteredAt" TIMESTAMP(3),
  ADD COLUMN "googleDriveRegisteredBy" TEXT;

CREATE TABLE "SelectionSession" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" "SelectionSessionType" NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "method" "SelectionMethod" NOT NULL,
  "location" TEXT,
  "meetingLink" TEXT,
  "interviewerId" TEXT,
  "interviewerName" TEXT,
  "notes" TEXT,
  "score" DOUBLE PRECISION,
  "status" "SelectionSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
  "resultNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SelectionSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SelectionSession_applicationId_scheduledAt_idx" ON "SelectionSession"("applicationId", "scheduledAt");
ALTER TABLE "SelectionSession" ADD CONSTRAINT "SelectionSession_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SelectionSession" ADD CONSTRAINT "SelectionSession_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
