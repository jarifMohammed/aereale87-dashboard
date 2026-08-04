import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getAdminKyc } from "@/features/admin-dashboard/kyc/api/get-admin-kyc";
import { AdminAuthorKycPage } from "@/features/admin-dashboard/kyc/components/admin-author-kyc-page";

export default async function AdminAuthorKycRoute() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  try {
    const data = await getAdminKyc(session.accessToken);
    return <AdminAuthorKycPage data={data} accessToken={session.accessToken} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load author KYC submissions.";

    return (
      <AdminAuthorKycPage
        data={[]}
        accessToken={session.accessToken}
        errorMessage={message}
      />
    );
  }
}
