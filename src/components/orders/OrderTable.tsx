import { Order } from "@/data/types";
import { StatusBadge, ChannelBadge } from "./OrderBadges";
import { DeliveryRiskBadge } from "./DeliveryRiskBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderTableProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export function OrderTable({ orders, onSelect }: OrderTableProps) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Pedido</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Cliente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Canal</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Estado</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Total</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Entrega</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.slice(0, 20).map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onSelect(order)}
            >
              <TableCell>
                <span className="font-mono text-sm font-medium">{order.id}</span>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm font-medium">{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <ChannelBadge channel={order.channel} />
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                ${order.total.toLocaleString("es-CL")}
              </TableCell>
              <TableCell>
                <DeliveryRiskBadge order={order} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(order.createdAt), "dd MMM yyyy", { locale: es })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No se encontraron pedidos con los filtros seleccionados.
        </div>
      )}
    </div>
  );
}
