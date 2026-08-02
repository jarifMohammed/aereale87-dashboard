import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TaxFormsPage } from "@/features/author-dashboard/tax-forms/components/tax-forms-page";

export default async function TaxFormsPageRoute() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return <TaxFormsPage accessToken={session.accessToken} />;
}
