import type {
  AuthorOrdersData,
  AuthorOrderRecord,
  OrderFulfillmentStatus,
} from "../types";

type BackendOrderItem = {
  id: string;
  bookId: string;
  bookTitle: string;
  coverImageUrl: string | null;
  formatId: string;
  formatType: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type BackendAuthorOrder = {
  id: string;
  stripeSessionId: string;
  status: OrderFulfillmentStatus;
  currency: string;
  totalAmount: number;
  authorTotalAmount: number;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  items: BackendOrderItem[];
  payout: {
    id: string;
    amount: number;
    platformFee: number;
    status: string;
    canRequestPayout: boolean;
  } | null;
};

type StatisticsResponse = {
  data?: {
    totalSales: number;
    totalRevenue: number;
  };
  totalSales?: number;
  totalRevenue?: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export async function getAuthorOrders(
  accessToken: string,
): Promise<AuthorOrdersData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  let rawOrders: BackendAuthorOrder[] = [];
  let statistics = { totalSales: 0, totalRevenue: 0 };

  try {
    const ordersRes = await fetch(`${baseUrl}/orders/author`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (ordersRes.ok) {
      const payload = await ordersRes.json();
      if (Array.isArray(payload)) {
        rawOrders = payload;
      } else if (payload && Array.isArray(payload.data)) {
        rawOrders = payload.data;
      }
      statistics.totalSales = rawOrders.length;
    } else {
      console.error("Failed to fetch author orders. Status:", ordersRes.status);
    }
  } catch (error) {
    console.error("Error fetching author orders:", error);
  }

  try {
    const statsRes = await fetch(`${baseUrl}/statistics/author`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (statsRes.ok) {
      const statsPayload = await statsRes.json();
      const statsData = statsPayload?.data || statsPayload;
      if (statsData) {
        statistics.totalSales = statsData.totalSales ?? rawOrders.length;
        statistics.totalRevenue = statsData.totalRevenue ?? 0;
      }
    } else {
      statistics.totalRevenue = rawOrders.reduce(
        (acc, o) => acc + (o.payout?.amount || o.authorTotalAmount || 0),
        0,
      );
    }
  } catch (error) {
    console.error("Error fetching author statistics:", error);
    statistics.totalRevenue = rawOrders.reduce(
      (acc, o) => acc + (o.payout?.amount || o.authorTotalAmount || 0),
      0,
    );
  }

  const records: AuthorOrderRecord[] = rawOrders.map((order) => {
    const productsSummary =
      order.items
        ?.map((i) => `${i.bookTitle} (${i.formatType} x${i.quantity})`)
        .join(", ") || "Order Items";

    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: order.id,
      payoutId: order.payout?.id || null,
      orderId: order.id.slice(0, 8).toUpperCase(),
      customerName: order.buyer?.name || "Customer",
      customerEmail: order.buyer?.email || "N/A",
      items: order.items || [],
      productsSummary,
      amount: formatCurrency(order.payout?.amount || order.authorTotalAmount || 0),
      rawAmount: order.payout?.amount || order.authorTotalAmount || 0,
      date: formattedDate,
      orderStatus: order.status || "COMPLETED",
      payoutStatus: order.payout?.status || "NO_PAYOUT",
      canRequestPayout: order.payout?.status === "PENDING_REQUEST",
    };
  });

  return {
    summary: [
      {
        id: "total-orders",
        label: "Total Orders",
        value: String(statistics.totalSales),
      },
      {
        id: "completed-orders",
        label: "Orders Delivered/Completed",
        value: String(
          records.filter((r) =>
            ["COMPLETED", "DELIVERED"].includes(r.orderStatus),
          ).length,
        ),
      },
      {
        id: "revenue-generated",
        label: "Author Revenue",
        value: formatCurrency(statistics.totalRevenue),
      },
    ],
    tabs: [
      { id: "all", label: `All Orders (${records.length})`, active: true },
      {
        id: "processing",
        label: `Processing (${records.filter((r) => r.orderStatus === "PROCESSING" || r.orderStatus === "PENDING").length})`,
      },
      {
        id: "shipped",
        label: `Shipped (${records.filter((r) => r.orderStatus === "SHIPPED").length})`,
      },
      {
        id: "delivered",
        label: `Delivered/Completed (${records.filter((r) => r.orderStatus === "DELIVERED" || r.orderStatus === "COMPLETED").length})`,
      },
    ],
    orders: records,
  };
}
