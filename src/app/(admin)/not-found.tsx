import { DashboardNotFound } from "@/components/errors/dashboard-not-found";

export default function NotFound() {
  return (
    <DashboardNotFound
      badge="Admin Control Room"
      title="This admin screen is off the grid."
      description="The admin route you tried to open is unavailable right now. You can jump back to the control room overview or return to the last known section."
      primaryHref="/admin-dashboard"
      primaryLabel="Admin overview"
      secondaryHref="/admin-dashboard/authors"
      secondaryLabel="Browse authors"
      tone="admin"
    />
  );
}
