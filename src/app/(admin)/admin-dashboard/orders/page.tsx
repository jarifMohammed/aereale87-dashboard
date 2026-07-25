import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getAdminOrders } from "@/features/admin-dashboard/orders/api/get-admin-orders";
import { AdminOrdersPage } from "@/features/admin-dashboard/orders/components/admin-orders-page";

export default async function AdminOrdersRoute() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const data = await getAdminOrders(session.accessToken);
  return <AdminOrdersPage data={data} accessToken={session.accessToken} />;
}
