export type OrderFulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type AuthorOrderStatus =
  | "Pending request"
  | "Requested"
  | "Approved"
  | "Paid"
  | "Rejected";

export type AuthorOrderTab = {
  id: string;
  label: string;
  active?: boolean;
};

export type AuthorOrderSummary = {
  id: string;
  label: string;
  value: string;
};

export type AuthorOrderItem = {
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

export type AuthorOrderRecord = {
  id: string;
  payoutId: string | null;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: AuthorOrderItem[];
  productsSummary: string;
  amount: string;
  rawAmount: number;
  date: string;
  orderStatus: OrderFulfillmentStatus;
  payoutStatus: string;
  canRequestPayout: boolean;
};

export type AuthorOrdersData = {
  summary: AuthorOrderSummary[];
  tabs: AuthorOrderTab[];
  orders: AuthorOrderRecord[];
};
