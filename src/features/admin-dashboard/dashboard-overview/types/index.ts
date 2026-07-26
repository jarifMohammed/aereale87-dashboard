export type AdminOverviewStat = {
  title: string;
  value: string;
  detail: string;
};

export type AdminPerformanceMetric = "bookViews" | "readers" | "downloads" | "revenue";

export type AdminPerformancePoint = {
  label: string;
  value: number;
};

export type AdminDashboardOverviewData = {
  stats: AdminOverviewStat[];
  performance: {
    activeMetric: AdminPerformanceMetric;
    availableMetrics: AdminPerformanceMetric[];
    thisWeek: AdminPerformancePoint[];
    lastWeek: AdminPerformancePoint[];
    summaryLabel: string;
  };
  submissions: {
    id: string;
    title: string;
    author: string;
    format: string;
    status: string;
    reviewValue: string;
    coverImageUrl: string | null;
  }[];
};

export type AdminStatisticsResponse = {
  totalUsers: number;
  totalPublishedBooks: number;
  totalSales: number;
  totalGrossRevenue: number;
  totalPlatformRevenue: number;
  revenueByDay: Array<{ date: string; revenue: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
};
