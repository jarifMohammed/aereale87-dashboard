import type { AdminKycListItem } from "../types";

export async function getAdminKyc(accessToken: string): Promise<AdminKycListItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/v1";
  const response = await fetch(`${baseUrl}/admin/kyc`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "";
    try {
      const payload = (await response.json()) as { message?: string | string[] };
      detail = Array.isArray(payload.message)
        ? payload.message.join("; ")
        : (payload.message ?? "");
    } catch {
      detail = response.statusText;
    }
    throw new Error(
      detail || `Unable to load author KYC submissions (HTTP ${response.status}).`,
    );
  }

  const payload = (await response.json()) as AdminKycListItem[] | { data: AdminKycListItem[] };
  return Array.isArray(payload) ? payload : payload.data;
}
