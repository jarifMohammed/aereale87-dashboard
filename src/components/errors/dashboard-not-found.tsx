"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, Home, Search, Shield, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardNotFoundProps = {
  badge: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  tone?: "default" | "admin" | "author";
};

const toneStyles = {
  default: {
    glow: "from-orange-200/60 via-transparent to-amber-100/50",
    badgeIcon: Sparkles,
    badgeBg: "bg-white/85 text-stone-700 border-stone-200",
    accent: "text-[#cfaf45]",
    panel: "from-white to-stone-50",
    primary: "bg-[#24352f] hover:bg-[#1b2823]",
  },
  admin: {
    glow: "from-amber-200/60 via-transparent to-lime-100/50",
    badgeIcon: Shield,
    badgeBg: "bg-white/85 text-stone-700 border-stone-200",
    accent: "text-[#cfaf45]",
    panel: "from-white to-[#f7f4ea]",
    primary: "bg-[#24352f] hover:bg-[#1b2823]",
  },
  author: {
    glow: "from-emerald-200/60 via-transparent to-sky-100/50",
    badgeIcon: BadgeCheck,
    badgeBg: "bg-white/85 text-stone-700 border-stone-200",
    accent: "text-[#66756d]",
    panel: "from-white to-[#f4f7f6]",
    primary: "bg-[#66756d] hover:bg-[#57655e]",
  },
} as const;

export function DashboardNotFound({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  tone = "default",
}: DashboardNotFoundProps) {
  const palette = toneStyles[tone];
  const BadgeIcon = palette.badgeIcon;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-stone-200 bg-[linear-gradient(180deg,#fffdf8_0%,#fcfbf7_100%)] p-6 shadow-sm md:p-10">
      <div className={cn("absolute inset-x-0 top-0 h-56 bg-gradient-to-br blur-3xl", palette.glow)} />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-5">
          <div className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.22em]", palette.badgeBg)}>
            <BadgeIcon className="size-4" />
            {badge}
          </div>

          <div className="space-y-3">
            <p className={cn("text-[82px] font-black leading-none md:text-[110px]", palette.accent)}>
              404
            </p>
            <h1 className="max-w-[12ch] text-3xl font-bold leading-tight text-stone-900 md:text-5xl">
              {title}
            </h1>
            <p className="max-w-[58ch] text-sm leading-7 text-stone-500 md:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className={cn("inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition", palette.primary)}
            >
              <Home className="size-4" />
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
            >
              <ArrowLeft className="size-4" />
              {secondaryLabel}
            </Link>
          </div>
        </section>

        <section className={cn("rounded-[28px] border border-stone-200 bg-gradient-to-br p-6 shadow-sm", palette.panel)}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-stone-700 shadow-sm ring-1 ring-stone-200">
              <Search className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Suggested Routes
              </p>
              <p className="mt-1 text-lg font-bold text-stone-900">Keep moving</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { href: primaryHref, title: primaryLabel, text: "Return to a stable dashboard entry point." },
              { href: secondaryHref, title: secondaryLabel, text: "Jump back instead of hitting a dead end." },
              { href: "/", title: "Main landing", text: "Leave the dashboard and head to the root app page." },
            ].map((item) => (
              <Link
                key={`${item.href}-${item.title}`}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 py-4 transition hover:border-stone-200 hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{item.text}</p>
                </div>
                <span className="pl-4 text-lg text-stone-400">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
