import type {
  AdminDashboardOverviewData,
  AdminStatisticsResponse,
} from "../types";
import type { AdminPendingBooksData } from "@/features/admin-dashboard/books/types";

type ApiEnvelope<T> = {
  data: T;
};

type AdminOrderRecord = {
  id: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    totalPrice: number;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function buildRevenueSeries(
  revenueByDay: AdminStatisticsResponse["revenueByDay"],
  offsetDays: number,
) {
  const revenueMap = new Map(
    revenueByDay.map((entry) => [entry.date, Number(entry.revenue) || 0]),
  );
  const today = startOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - offsetDays - (6 - index));
    const iso = date.toISOString().split("T")[0];

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      value: revenueMap.get(iso) ?? 0,
    };
  });
}

function getLast7DaysCount(items: { createdAt?: string }[]) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  return items.filter((item) => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt) >= cutoff;
  }).length;
}

export async function getAdminDashboardOverview(
  accessToken: string,
): Promise<AdminDashboardOverviewData> {
  const [statisticsResponse, ordersResponse, pendingBooksResponse] =
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/admin`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/pending?limit=6`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
    ]);

  if (
    !statisticsResponse.ok ||
    !ordersResponse.ok ||
    !pendingBooksResponse.ok
  ) {
    throw new Error("Failed to load admin dashboard overview.");
  }

  const statisticsPayload =
    (await statisticsResponse.json()) as ApiEnvelope<AdminStatisticsResponse>;
  const ordersPayload = (await ordersResponse.json()) as
    | ApiEnvelope<AdminOrderRecord[]>
    | AdminOrderRecord[];
  const pendingBooksPayload =
    (await pendingBooksResponse.json()) as ApiEnvelope<AdminPendingBooksData>;

  const statistics = statisticsPayload.data;
  const orders = Array.isArray(ordersPayload)
    ? ordersPayload
    : ordersPayload.data;
  const pendingBooks = pendingBooksPayload.data.books;

  const ordersLast7Days = getLast7DaysCount(orders);
  const booksLast7Days = getLast7DaysCount(pendingBooks);
  const thisWeekRevenue = buildRevenueSeries(statistics.revenueByDay, 0);
  const lastWeekRevenue = buildRevenueSeries(statistics.revenueByDay, 7);
  const weeklyRevenueTotal = thisWeekRevenue.reduce(
    (total, item) => total + item.value,
    0,
  );

  return {
    stats: [
      {
        title: "Books Published",
        value: String(statistics.totalPublishedBooks),
        detail: `${booksLast7Days} in last 7 days`,
      },
      {
        title: "Total Orders",
        value: formatCompactNumber(orders.length),
        detail: `${ordersLast7Days} in last 7 days`,
      },
      {
        title: "Total Authors",
        value: formatCompactNumber(statistics.totalUsers),
        detail: "registered users",
      },
      {
        title: "Platform Revenue",
        value: formatCurrency(statistics.totalPlatformRevenue),
        detail: `${formatCurrency(weeklyRevenueTotal)} this week`,
      },
    ],
    performance: {
      activeMetric: "revenue",
      availableMetrics: ["bookViews", "readers", "downloads", "revenue"],
      thisWeek: thisWeekRevenue,
      lastWeek: lastWeekRevenue,
      summaryLabel: "Revenue trend from live platform fees",
    },
    submissions: pendingBooks.map((book) => {
      const authorName = book.author?.profile
        ? `${book.author.profile.firstName || ""} ${book.author.profile.lastName || ""}`.trim()
        : "";
      const firstFormat = book.formats[0];
      const reviewValue =
        firstFormat?.listPrice != null
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(firstFormat.listPrice)
          : "--";

      return {
        id: book.id,
        title: book.title,
        author:
          authorName || book.author?.username || book.author?.email || "Unknown",
        format: firstFormat?.formatType || "N/A",
        status:
          book.status === "SUBMITTED"
            ? "Pending"
            : book.status.charAt(0) + book.status.slice(1).toLowerCase(),
        reviewValue,
        coverImageUrl: book.bookCover,
      };
    }),
  };
}
