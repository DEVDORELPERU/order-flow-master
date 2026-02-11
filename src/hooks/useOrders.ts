import { useCallback, useMemo, useState } from "react";
import { Order, OrderStatus, Channel } from "@/data/types";
import { MOCK_ORDERS } from "@/data/orders";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (channelFilter !== "all" && o.channel !== channelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, channelFilter, search]);

  const countByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return map;
  }, [orders]);

  const countByChannel = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.channel] = (map[o.channel] || 0) + 1;
    });
    return map;
  }, [orders]);

  const confirmDelivery = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "delivered" as OrderStatus, actualDeliveryDate: new Date().toISOString() }
          : o
      )
    );
  }, []);

  return {
    orders: filtered,
    allOrders: orders,
    statusFilter,
    setStatusFilter,
    channelFilter,
    setChannelFilter,
    search,
    setSearch,
    countByStatus,
    countByChannel,
    confirmDelivery,
  };
}
