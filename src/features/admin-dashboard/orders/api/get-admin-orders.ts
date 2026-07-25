import type { AdminOrdersData, AdminOrderRecord, OrderFulfillmentStatus } from "../types";

type BackendAdminOrder = {
  id: string;
  stripeSessionId: string;
  status: OrderFulfillmentStatus;
  currency: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  authors: { id: string; name: string; email: string }[];
  items: {
    id: string;
    bookId: string;
    bookTitle: string;
    coverImageUrl: string | null;
    formatId: string;
    formatType: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    authorId: string;
  }[];
  payouts: {
    id: string;
    authorId: string;
    amount: number;
    platformFee: number;
    status: string;
  }[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export async function getAdminOrders(
  accessToken: string,
): Promise<AdminOrdersData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let rawOrders: BackendAdminOrder[] = [];

  try {
    const response = await fetch(`${baseUrl}/orders/admin`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload)) {
        rawOrders = payload;
      } else if (payload && Array.isArray(payload.data)) {
        rawOrders = payload.data;
      }
    } else {
      console.error("Failed to load admin orders. Status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching admin orders:", error);
  }

  const records: AdminOrderRecord[] = rawOrders.map((order) => {
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
      ...order,
      orderId: order.id.slice(0, 8).toUpperCase(),
      formattedDate,
      formattedAmount: formatCurrency(order.totalAmount || 0),
      productsSummary,
    };
  });

  const totalVolume = records.reduce((acc, r) => acc + r.totalAmount, 0);

  return {
    summary: [
      {
        id: "total-orders",
        label: "Total Orders",
        value: String(records.length),
      },
      {
        id: "total-volume",
        label: "Total Gross Volume",
        value: formatCurrency(totalVolume),
      },
      {
        id: "processing-orders",
        label: "Active / Processing",
        value: String(
          records.filter((r) =>
            ["PENDING", "PROCESSING", "SHIPPED"].includes(r.status),
          ).length,
        ),
      },
    ],
    orders: records,
  };
}
