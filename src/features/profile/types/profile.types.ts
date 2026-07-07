export type ProfileCompletionStatus = "incomplete" | "complete";

export type ProfileData = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  approvalStatus: string;
};
