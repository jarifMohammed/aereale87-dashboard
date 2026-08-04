export type AdminKycStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type AdminKycListItem = {
  id: string;
  authId: string;
  kycStatus: AdminKycStatus;
  adminNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  taxFormFileUrl: string | null;
  author: {
    id?: string;
    email: string;
    username: string;
    userProfile?: {
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };
};
