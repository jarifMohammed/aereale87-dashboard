export type OrderFulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type AdminOrderAuthor = {
  id: string;
  name: string;
  email: string;
};

export type AdminOrderItem = {
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
};

export type AdminOrderPayout = {
  id: string;
  authorId: string;
  amount: number;
  platformFee: number;
  status: string;
};

export type AdminOrderRecord = {
  id: string;
  stripeSessionId: string;
  orderId: string;
  status: OrderFulfillmentStatus;
  currency: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  createdAt: string;
  formattedDate: string;
  formattedAmount: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  authors: AdminOrderAuthor[];
  items: AdminOrderItem[];
  payouts: AdminOrderPayout[];
  productsSummary: string;
};

export type AdminOrdersSummary = {
  id: string;
  label: string;
  value: string;
};

export type AdminOrdersData = {
  summary: AdminOrdersSummary[];
  orders: AdminOrderRecord[];
};
