import { Package, TrendingUp, Clock, AlertTriangle, Timer } from "lucide-react";
import { Order } from "@/data/types";
import { countDeliveryRisks } from "@/lib/deliveryUtils";

interface KPICardsProps {
  orders: Order[];
}

export function KPICards({ orders }: KPICardsProps) {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const inTransit = orders.filter((o) => o.status === "in_transit").length;
  const incidents = orders.filter((o) => o.status === "incident" || o.status === "rejected").length;
  const { total: delayRiskTotal, atRisk, late } = countDeliveryRisks(orders);

  const cards = [
    {
      label: "Total Pedidos",
      value: total,
      icon: Package,
      accent: "text-primary",
      bgAccent: "bg-primary/10",
    },
    {
      label: "Pendientes",
      value: pending,
      icon: Clock,
      accent: "text-yellow-600",
      bgAccent: "bg-yellow-50",
    },
    {
      label: "En Tránsito",
      value: inTransit,
      icon: TrendingUp,
      accent: "text-sky-600",
      bgAccent: "bg-sky-50",
    },
    {
      label: "Incidencias",
      value: incidents,
      icon: AlertTriangle,
      accent: "text-destructive",
      bgAccent: "bg-red-50",
    },
    {
      label: "Riesgo de Retraso",
      value: delayRiskTotal,
      icon: Timer,
      accent: "text-amber-600",
      bgAccent: "bg-amber-50",
      subtitle: `${atRisk} en riesgo · ${late} retrasados`,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="bg-card rounded-lg border p-4 animate-slide-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.bgAccent}`}>
              <card.icon className={`w-4 h-4 ${card.accent}`} />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight">{card.value}</div>
          {"subtitle" in card && card.subtitle && (
            <div className="text-[10px] text-muted-foreground mt-1">{card.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}