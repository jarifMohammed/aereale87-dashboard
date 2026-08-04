"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle, Clock, ExternalLink, Search, XCircle } from "lucide-react";

import { AdminKycReviewPanel } from "@/features/admin-dashboard/authors/components/admin-kyc-review-panel";
import { cn } from "@/lib/utils";
import type { AdminKycListItem, AdminKycStatus } from "../types";

const statusStyles: Record<AdminKycStatus, string> = {
  NOT_SUBMITTED: "bg-stone-100 text-stone-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function getDisplayName(item: AdminKycListItem) {
  const first = item.author.userProfile?.firstName ?? "";
  const last = item.author.userProfile?.lastName ?? "";
  return `${first} ${last}`.trim() || item.author.username || item.author.email;
}

export function AdminAuthorKycPage({
  data,
  accessToken,
  errorMessage,
}: {
  data: AdminKycListItem[];
  accessToken: string;
  errorMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(
    data.find((item) => item.kycStatus === "SUBMITTED")?.authId ?? data[0]?.authId ?? null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      const name = getDisplayName(item).toLowerCase();
      return (
        name.includes(q) ||
        item.author.email.toLowerCase().includes(q) ||
        item.author.username.toLowerCase().includes(q) ||
        item.kycStatus.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  const selected =
    filtered.find((item) => item.authId === selectedAuthorId) ??
    data.find((item) => item.authId === selectedAuthorId) ??
    null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Author KYC</h1>
        <p className="text-sm text-slate-500">
          Review submitted identity and tax form documents from one dedicated place.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#24352f]">
              <BadgeCheck className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">KYC Queue</h2>
              <p className="text-xs text-neutral-500">{data.length} submission(s)</p>
            </div>
          </div>

          <div className="mt-4 flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3">
            <Search className="size-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search author, email, status"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-4 space-y-3">
            {!filtered.length ? (
              <div className="rounded-xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-500 ring-1 ring-stone-200">
                No KYC submissions found.
              </div>
            ) : (
              filtered.map((item) => {
                const name = getDisplayName(item);
                const isActive = item.authId === selected?.authId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAuthorId(item.authId)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition",
                      isActive
                        ? "border-[#cfaf45] bg-[#cfaf45]/10"
                        : "border-stone-200 bg-white hover:bg-stone-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-neutral-900">{name}</p>
                        <p className="truncate text-xs text-neutral-500">{item.author.email}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          statusStyles[item.kycStatus],
                        )}
                      >
                        {item.kycStatus}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        {item.submittedAt
                          ? `Submitted ${new Date(item.submittedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}`
                          : "No submit date"}
                      </span>
                      {item.kycStatus === "SUBMITTED" ? (
                        <Clock className="size-4 text-amber-500" />
                      ) : item.kycStatus === "APPROVED" ? (
                        <CheckCircle className="size-4 text-green-600" />
                      ) : item.kycStatus === "REJECTED" ? (
                        <XCircle className="size-4 text-red-500" />
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-4">
          {selected ? (
            <>
              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-stone-200">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Selected author</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{getDisplayName(selected)}</h2>
                  <p className="text-sm text-slate-500">{selected.author.email}</p>
                </div>
                <Link
                  href={`/admin-dashboard/authors/${selected.authId}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-stone-50"
                >
                  Open author details
                  <ExternalLink className="size-4" />
                </Link>
              </div>

              <AdminKycReviewPanel
                authorId={selected.authId}
                accessToken={accessToken}
              />
            </>
          ) : (
            <div className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-stone-500 shadow-sm ring-1 ring-stone-200">
              Select an author KYC record to review.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
