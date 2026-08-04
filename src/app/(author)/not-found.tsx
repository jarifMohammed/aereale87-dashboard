import { DashboardNotFound } from "@/components/errors/dashboard-not-found";

export default function NotFound() {
  return (
    <DashboardNotFound
      badge="Author Workspace"
      title="This author page isn’t available."
      description="The page may have moved or the link may be outdated. Head back to your author dashboard and continue from a known workspace."
      primaryHref="/author-dashboard"
      primaryLabel="Author overview"
      secondaryHref="/author-dashboard/books"
      secondaryLabel="My books"
      tone="author"
    />
  );
}
