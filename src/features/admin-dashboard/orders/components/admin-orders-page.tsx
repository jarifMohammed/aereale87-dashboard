"use client";

import { useState } from "react";
import { Search, Package } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  AdminOrdersData,
  AdminOrdersSummary,
  OrderFulfillmentStatus,
} from "../types";

type AdminOrdersPageProps = {
  data: AdminOrdersData;
  accessToken: string;
};

const ORDER_STATUS_OPTIONS: { value: OrderFulfillmentStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function FulfillmentStatusBadge({
  status,
  onChangeStatus,
  isUpdating,
}: {
  status: OrderFulfillmentStatus;
  onChangeStatus: (newStatus: OrderFulfillmentStatus) => void;
  isUpdating: boolean;
}) {
  const getBadgeStyle = (st: OrderFulfillmentStatus) => {
    switch (st) {
      case "COMPLETED":
      case "DELIVERED":
        return "border-emerald-200 bg-emerald-100 text-emerald-800";
      case "SHIPPED":
        return "border-blue-200 bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "border-amber-200 bg-amber-100 text-amber-800";
      case "CANCELLED":
      case "FAILED":
        return "border-red-200 bg-red-100 text-red-700";
      default:
        return "border-stone-300 bg-stone-100 text-stone-700";
    }
  };

  return (
    <select
      value={status}
      disabled={isUpdating}
      onChange={(e) => onChangeStatus(e.target.value as OrderFulfillmentStatus)}
      className={cn(
        "cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider outline-none transition-colors disabled:opacity-50",
        getBadgeStyle(status)
      )}
    >
      {ORDER_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-white text-neutral-800">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SummaryCard({ item }: { item: AdminOrdersSummary }) {
  return (
    <div className="flex-1 border border-stone-300 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-neutral-500">{item.label}</div>
        <div className="text-3xl font-bold tracking-tight text-neutral-800">{item.value}</div>
      </div>
    </div>
  );
}

export function AdminOrdersPage({ data, accessToken }: AdminOrdersPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: OrderFulfillmentStatus;
    }) => {
      setUpdatingOrderId(orderId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update order status.");
      }
      return payload;
    },
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      setUpdatingOrderId(null);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setUpdatingOrderId(null);
    },
  });

  const filteredOrders = data.orders.filter((order) => {
    // Tab filter
    if (activeTab === "processing" && !["PROCESSING", "PENDING"].includes(order.status)) {
      return false;
    }
    if (activeTab === "shipped" && order.status !== "SHIPPED") {
      return false;
    }
    if (
      activeTab === "delivered" &&
      !["DELIVERED", "COMPLETED"].includes(order.status)
    ) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderId.toLowerCase().includes(q) || order.id.toLowerCase().includes(q);
      const matchCustomer =
        (order.buyer?.name ?? "").toLowerCase().includes(q) ||
        (order.buyer?.email ?? "").toLowerCase().includes(q);
      const matchAuthors = (order.authors ?? []).some(
        (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
      );
      const matchProducts = order.productsSummary.toLowerCase().includes(q);
      return matchId || matchCustomer || matchAuthors || matchProducts;
    }

    return true;
  });

  const tabs = [
    { id: "all", label: `All Orders (${data.orders.length})` },
    {
      id: "processing",
      label: `Processing (${data.orders.filter((r) => r.status === "PROCESSING" || r.status === "PENDING").length})`,
    },
    {
      id: "shipped",
      label: `Shipped (${data.orders.filter((r) => r.status === "SHIPPED").length})`,
    },
    {
      id: "delivered",
      label: `Delivered/Completed (${data.orders.filter((r) => r.status === "DELIVERED" || r.status === "COMPLETED").length})`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-800">All Author Orders</h1>
        <p className="text-sm text-neutral-500">
          Monitor and manage orders across all platform authors and customers.
        </p>
      </div>

      <section className="flex flex-col gap-5 xl:flex-row">
        {data.summary.map((item) => (
          <SummaryCard key={item.id} item={item} />
        ))}
      </section>

      <Card className="rounded-none bg-white py-0 shadow-none ring-1 ring-stone-300">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Filter Tabs */}
            <div className="flex min-h-9 flex-1 flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#cfaf45] text-white shadow-sm"
                        : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search */}
            <div className="flex items-center gap-3">
              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  placeholder="Search order ID, customer, author, book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 border border-stone-300 bg-stone-50 py-2 pl-9 pr-4 text-sm text-neutral-800 outline-none transition-colors focus:border-stone-500 focus:bg-white"
                />
                <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <div className="min-w-[1100px]">
                <div className="inline-flex w-full items-center border-b bg-lime-50 font-semibold text-neutral-800">
                  <div className="w-28 px-4 py-3 text-xs uppercase">ORDER ID</div>
                  <div className="w-48 px-4 py-3 text-xs uppercase">CUSTOMER</div>
                  <div className="w-48 px-4 py-3 text-xs uppercase">AUTHOR(S)</div>
                  <div className="flex-1 px-4 py-3 text-xs uppercase">BOOKS & FORMATS</div>
                  <div className="w-32 px-4 py-3 text-xs uppercase text-right">AMOUNT</div>
                  <div className="w-32 px-4 py-3 text-xs uppercase text-center">DATE</div>
                  <div className="w-44 px-4 py-3 text-xs uppercase text-center">FULFILLMENT STATUS</div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Package className="size-12 text-stone-300" strokeWidth={1.5} />
                    <p className="mt-2 text-base font-medium text-stone-600">No orders found</p>
                    <p className="text-sm text-stone-400">
                      {searchQuery
                        ? "Try adjusting your search terms."
                        : "Platform orders will appear here once customers make purchases."}
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="inline-flex w-full items-center border-b border-stone-200 text-sm hover:bg-stone-50/50 transition-colors"
                    >
                      <div className="w-28 px-4 py-4 font-mono font-semibold text-neutral-800">
                        #{order.orderId}
                      </div>

                      <div className="w-48 px-4 py-4">
                        <p className="font-semibold text-neutral-800">{order.buyer?.name ?? "Unknown Customer"}</p>
                        <p className="text-xs text-stone-500 truncate">{order.buyer?.email ?? "No email"}</p>
                      </div>

                      <div className="w-48 px-4 py-4">
                        {(order.authors ?? []).length === 0 ? (
                          <span className="text-xs text-stone-400">N/A</span>
                        ) : (
                          (order.authors ?? []).map((a) => (
                            <div key={a.id} className="text-xs">
                              <span className="font-medium text-neutral-800">{a.name}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex-1 px-4 py-4">
                        <p className="font-medium text-neutral-800 line-clamp-2">
                          {order.productsSummary}
                        </p>
                      </div>

                      <div className="w-32 px-4 py-4 font-bold text-neutral-800 text-right">
                        {order.formattedAmount}
                      </div>

                      <div className="w-32 px-4 py-4 text-stone-600 text-center text-xs">
                        {order.formattedDate}
                      </div>

                      <div className="w-44 px-4 py-4 text-center">
                        <FulfillmentStatusBadge
                          status={order.status}
                          isUpdating={updatingOrderId === order.id}
                          onChangeStatus={(newStatus) =>
                            updateStatusMutation.mutate({ orderId: order.id, newStatus })
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
