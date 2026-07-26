import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function AuthShell({ children, className, narrow = false }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ed] px-5 py-16 text-[#24463d] sm:px-8">
      <div
        className={`mx-auto border border-[#ece4d6] bg-white p-6 shadow-[0_8px_30px_rgba(58,44,10,0.08)] sm:p-8 ${
          narrow ? "max-w-[560px]" : "max-w-[640px]"
        } ${className ?? ""}`}
      >
        {children}
      </div>
    </main>
  );
}
