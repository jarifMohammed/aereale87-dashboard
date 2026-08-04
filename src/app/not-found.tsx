import { DashboardNotFound } from "@/components/errors/dashboard-not-found";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fcfbf7] px-4 py-6 md:px-6 md:py-8">
      <DashboardNotFound
        badge="Dashboard Route Missing"
        title="That dashboard page couldn’t be found."
        description="The route may have changed, been removed, or never existed in this environment. Use one of the quick exits below to get back on track."
        primaryHref="/"
        primaryLabel="Back to sign in"
        secondaryHref="/"
        secondaryLabel="Return home"
      />
    </main>
  );
}
