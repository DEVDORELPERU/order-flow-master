import { OrderStatus, Channel } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  on_hold: "bg-amber-100 text-amber-800 border-amber-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  in_transit: "bg-sky-100 text-sky-800 border-sky-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  incident: "bg-red-100 text-red-800 border-red-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  returned: "bg-purple-100 text-purple-800 border-purple-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  on_hold: "En espera",
  preparing: "En preparación",
  ready: "Listo",
  in_transit: "En tránsito",
  delivered: "Entregado",
  incident: "Incidencia",
  closed: "Cerrado",
  returned: "Devuelto",
  rejected: "Rechazado",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}

const channelStyles: Record<Channel, string> = {
  ecommerce: "bg-indigo-100 text-indigo-700 border-indigo-200",
  marketplace: "bg-teal-100 text-teal-700 border-teal-200",
  store: "bg-rose-100 text-rose-700 border-rose-200",
  call_center: "bg-slate-100 text-slate-700 border-slate-200",
};

const channelLabels: Record<Channel, string> = {
  ecommerce: "E-Commerce",
  marketplace: "Marketplace",
  store: "Tienda Física",
  call_center: "Call Center",
};

const channelIcons: Record<Channel, string> = {
  ecommerce: "🌐",
  marketplace: "🏪",
  store: "🏬",
  call_center: "📞",
};

export function ChannelBadge({ channel }: { channel: Channel }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", channelStyles[channel])}>
      {channelIcons[channel]} {channelLabels[channel]}
    </Badge>
  );
}
