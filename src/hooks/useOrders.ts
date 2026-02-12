import { useCallback, useEffect, useMemo, useState } from "react";
import { Order, OrderStatus, Channel } from "@/data/types";
import {
  selectOrdenes,
  selectAllOrdenes,
  countByStatusQuery,
  countByChannelQuery,
  updateDeliveryStatus,
  QueryFilters,
} from "@/lib/database";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [countByStatus, setCountByStatus] = useState<Record<string, number>>({});
  const [countByChannel, setCountByChannel] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");
  const [search, setSearch] = useState("");

  // Cargar datos desde la "base de datos"
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filters: QueryFilters = {
        status: statusFilter,
        channel: channelFilter,
        search,
      };

      const [result, all, statusCounts, channelCounts] = await Promise.all([
        selectOrdenes(filters),
        selectAllOrdenes(),
        countByStatusQuery(),
        countByChannelQuery(),
      ]);

      setOrders(result.data);
      setAllOrders(all);
      setCountByStatus(statusCounts);
      setCountByChannel(channelCounts);
    } catch (error) {
      console.error("[DB Error]", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, channelFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const confirmDelivery = useCallback(async (orderId: string) => {
    await updateDeliveryStatus(orderId);
    await fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    allOrders,
    statusFilter,
    setStatusFilter,
    channelFilter,
    setChannelFilter,
    search,
    setSearch,
    countByStatus,
    countByChannel,
    confirmDelivery,
    loading,
  };
}
