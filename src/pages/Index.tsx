import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { KPICards } from "@/components/orders/KPICards";
import { PipelineView } from "@/components/orders/PipelineView";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderDetail } from "@/components/orders/OrderDetail";
import { Order } from "@/data/types";
import { LayoutDashboard } from "lucide-react";

const Index = () => {
  const {
    orders,
    allOrders,
    statusFilter,
    setStatusFilter,
    channelFilter,
    setChannelFilter,
    search,
    setSearch,
    countByStatus,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight">
              Gestión de Pedidos
            </h1>
          </div>
          <span className="text-xs text-muted-foreground ml-1">Multicanal</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* KPIs */}
        <KPICards orders={allOrders} />

        {/* Pipeline */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Pipeline de Pedidos
          </h2>
          <PipelineView countByStatus={countByStatus} />
        </section>

        {/* Orders Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Listado de Pedidos ({orders.length})
            </h2>
          </div>
          <OrderFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            channelFilter={channelFilter}
            onChannelChange={setChannelFilter}
          />
          <div className="mt-4">
            <OrderTable orders={orders} onSelect={setSelectedOrder} />
          </div>
        </section>
      </main>

      {/* Order Detail Sheet */}
      <OrderDetail
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default Index;
