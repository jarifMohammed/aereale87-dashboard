import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPendingBooks } from "@/features/admin-dashboard/books/api/get-pending-books";
import { AdminBooksApprovalPage } from "@/features/admin-dashboard/books/components/admin-books-approval-page";

export default async function AdminBooksApprovalsRoute() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) redirect("/");

  try {
    const data = await getPendingBooks(session.accessToken);
    return <AdminBooksApprovalPage data={data} accessToken={session.accessToken} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load pending books.";

    return (
      <AdminBooksApprovalPage
        data={{ books: [], total: 0, page: 1, limit: 50, totalPages: 0 }}
        accessToken={session.accessToken}
        errorMessage={message}
      />
    );
  }
}
