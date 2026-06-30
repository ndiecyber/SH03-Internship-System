import type { UserRole } from "@/types/roles";

const protectedSegments: Record<string, UserRole> = {
  "/admin": "ADMIN",
  "/mentor": "MENTOR",
  "/intern": "INTERN"
};

export function getRequiredRoleForPath(pathname: string): UserRole | null {
  const matchedSegment = Object.keys(protectedSegments).find((segment) =>
    pathname.startsWith(segment)
  );

  return matchedSegment ? protectedSegments[matchedSegment] : null;
}
