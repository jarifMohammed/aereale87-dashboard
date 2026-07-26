import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { AdminSettingsPage } from "@/features/admin-dashboard/settings/components/admin-settings-page";

type ProfileData = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  location: string | null;
};

const emptyProfile: ProfileData = {
  firstName: null,
  lastName: null,
  avatarUrl: null,
  location: null,
};

async function getProfile(accessToken: string): Promise<ProfileData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return emptyProfile;

    const json = (await response.json()) as {
      data?: { data?: { profile?: ProfileData }; profile?: ProfileData };
    };
    const me = json.data?.data ?? json.data;
    return me?.profile ?? emptyProfile;
  } catch {
    return emptyProfile;
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const profile = await getProfile(session.accessToken);

  return (
    <AdminSettingsPage
      accessToken={session.accessToken}
      email={session.user.email ?? ""}
      name={session.user.name ?? ""}
      role={session.user.role}
      initialProfile={profile}
    />
  );
}
