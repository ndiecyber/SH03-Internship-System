import type { NavigationSection } from "@/types/navigation";

export const roleNavigation: NavigationSection[] = [
  {
    role: "INTERN",
    label: "Intern",
    items: [
      { href: "/intern/dashboard", label: "Dashboard" },
      { href: "/intern/internship-registration", label: "Registration" },
      { href: "/intern/logbook", label: "Logbook" },
      { href: "/intern/progress", label: "Progress" },
      { href: "/intern/certificate", label: "Certificate" },
      { href: "/intern/announcements", label: "Announcements" },
      { href: "/intern/profile", label: "Profile" }
    ]
  },
  {
    role: "MENTOR",
    label: "Mentor",
    items: [
      { href: "/mentor/dashboard", label: "Dashboard" },
      { href: "/mentor/assigned-interns", label: "Assigned Interns" },
      { href: "/mentor/logbook-review", label: "Logbook Review" },
      { href: "/mentor/evaluation", label: "Evaluation" },
      { href: "/mentor/announcements", label: "Announcements" },
      { href: "/mentor/profile", label: "Profile" }
    ]
  },
  {
    role: "ADMIN",
    label: "Admin",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/applicants", label: "Applicants" },
      { href: "/admin/interns", label: "Interns" },
      { href: "/admin/google-drive-interns", label: "Google Drive" },
      { href: "/admin/mentors", label: "Mentors" },
      { href: "/admin/internship-programs", label: "Programs" },
      { href: "/admin/monitoring", label: "Monitoring" },
      { href: "/admin/reports", label: "Reports" },
      { href: "/admin/announcements", label: "Announcements" },
      { href: "/admin/settings", label: "Settings" }
    ]
  }
];
