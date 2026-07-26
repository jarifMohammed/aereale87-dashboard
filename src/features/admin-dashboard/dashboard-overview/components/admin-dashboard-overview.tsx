"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageTitle } from "@/components/shared/page-title";

import type {
  AdminDashboardOverviewData,
  AdminPerformanceMetric,
  AdminPerformancePoint,
} from "../types";

const metricLabels: Record<AdminPerformanceMetric, string> = {
  bookViews: "Book Views",
  readers: "Readers",
  downloads: "Downloads",
  revenue: "Revenue",
};

type AdminDashboardOverviewProps = {
  data: AdminDashboardOverviewData;
};

function formatChartValue(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return `${Math.round(value)}`;
}

function buildChartPath(points: AdminPerformancePoint[], chartHeight: number) {
  if (!points.length) return "";

  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const stepX = points.length > 1 ? 100 / (points.length - 1) : 100;

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = chartHeight - (point.value / maxValue) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function getPointCoordinates(points: AdminPerformancePoint[], chartHeight: number) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const stepX = points.length > 1 ? 100 / (points.length - 1) : 100;

  return points.map((point, index) => ({
    ...point,
    x: index * stepX,
    y: chartHeight - (point.value / maxValue) * chartHeight,
  }));
}

function PerformanceChart({
  points,
}: {
  points: AdminPerformancePoint[];
}) {
  const chartHeight = 220;
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const chartPath = buildChartPath(points, chartHeight);
  const coordinates = getPointCoordinates(points, chartHeight);
  const yAxisValues = Array.from({ length: 7 }, (_, index) =>
    Math.round((maxValue / 6) * (6 - index)),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[48px_1fr] gap-4">
        <div className="flex h-[220px] flex-col justify-between text-[11px] font-medium text-neutral-400">
          {yAxisValues.map((value, index) => (
            <span key={`${value}-${index}`}>{formatChartValue(value)}</span>
          ))}
        </div>

        <div className="relative h-[220px]">
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="border-t border-dashed border-[#eadfcb]"
              />
            ))}
          </div>

          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="relative h-full w-full"
          >
            <defs>
              <linearGradient id="overview-chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2f5a4d" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#2f5a4d" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path
              d={`${chartPath} L 100 ${chartHeight} L 0 ${chartHeight} Z`}
              fill="url(#overview-chart-fill)"
            />
            <path
              d={chartPath}
              fill="none"
              stroke="#2f5a4d"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />

            {coordinates.map((point) => (
              <g key={`${point.label}-${point.x}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.9"
                  fill="#ffffff"
                  stroke="#2f5a4d"
                  strokeWidth="1.3"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pl-[64px] text-[11px] font-medium text-neutral-400">
        {points.map((point) => (
          <span key={point.label} className="text-left">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardOverview({ data }: AdminDashboardOverviewProps) {
  const [comparisonWindow, setComparisonWindow] = useState<"thisWeek" | "lastWeek">(
    "thisWeek",
  );
  const activeMetric = data.performance.activeMetric;
  const selectedPoints = useMemo(
    () =>
      comparisonWindow === "thisWeek"
        ? data.performance.thisWeek
        : data.performance.lastWeek,
    [comparisonWindow, data.performance.lastWeek, data.performance.thisWeek],
  );

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Overview"
        title="Admin dashboard overview"
        description="A clean operational snapshot of publishing activity, order flow, revenue movement, and the latest submissions waiting on review."
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 outline outline-1 outline-offset-[-1px] outline-stone-200"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium leading-5 text-neutral-500">
                {stat.title}
              </p>
              <p className="text-4xl font-bold leading-10 text-neutral-800">
                {stat.value}
              </p>
              <p className="pt-1 text-xs leading-4 text-neutral-500">
                {stat.detail}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white p-6 outline outline-1 outline-offset-[-1px] outline-stone-300">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold leading-7 text-green-900">
              Platform Performance
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {data.performance.summaryLabel}
            </p>
          </div>

          <div className="inline-flex w-fit items-center bg-stone-100 outline outline-1 outline-offset-[-1px] outline-stone-300">
            <button
              type="button"
              onClick={() => setComparisonWindow("thisWeek")}
              className={`px-4 py-1.5 text-sm font-medium leading-5 ${
                comparisonWindow === "thisWeek"
                  ? "bg-white text-green-900"
                  : "text-neutral-500"
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setComparisonWindow("lastWeek")}
              className={`px-4 py-1.5 text-sm font-medium leading-5 ${
                comparisonWindow === "lastWeek"
                  ? "bg-white text-green-900"
                  : "text-neutral-500"
              }`}
            >
              Last Week
            </button>
          </div>
        </div>

        <div className="mt-6 border-b border-stone-200">
          <div className="inline-flex flex-wrap items-start gap-6">
            {data.performance.availableMetrics.map((metric) => {
              const isActive = metric === activeMetric;

              return (
                <button
                  key={metric}
                  type="button"
                  disabled={!isActive}
                  className={`pb-3 text-sm font-medium leading-5 ${
                    isActive
                      ? "border-b-2 border-green-900 text-green-900"
                      : "pb-[14px] text-neutral-500"
                  }`}
                >
                  {metricLabels[metric]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 overflow-hidden pt-2">
          <PerformanceChart points={selectedPoints} />
        </div>
      </section>

      <section className="bg-white p-6 outline outline-1 outline-offset-[-1px] outline-stone-300">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-neutral-800">
            Recent Author Submissions
          </h2>
          <Link
            href="/admin-dashboard/books"
            className="inline-flex h-10 items-center justify-center border border-[#d2ab26] px-5 text-xs font-bold uppercase tracking-[0.5px] text-[#d2ab26] transition hover:bg-[#d2ab26] hover:text-white"
          >
            View All
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-0 text-left">
            <thead>
              <tr className="bg-[#edf5e7] text-[11px] uppercase tracking-[0.4px] text-neutral-700">
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Author</th>
                <th className="px-5 py-4 font-medium">Format</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-stone-200 text-sm text-neutral-700"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-6 shrink-0 overflow-hidden rounded-[2px] bg-stone-100">
                        {item.coverImageUrl ? (
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="font-semibold text-[#15352c]">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600">{item.author}</td>
                  <td className="px-5 py-4 text-neutral-600">{item.format}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[#fff4e6] px-4 py-1 text-xs font-medium text-[#e9a03b]">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-[#15352c]">
                    {item.reviewValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
