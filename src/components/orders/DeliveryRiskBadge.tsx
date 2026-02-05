import { Order } from "@/data/types";
import { getDeliveryRisk, DeliveryRisk } from "@/lib/deliveryUtils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

const riskConfig: Record<DeliveryRisk, { label: string; className: string; icon: typeof Clock }> = {
  on_time: { label: "En tiempo", className: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  at_risk: { label: "En riesgo", className: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  late: { label: "Retrasado", className: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
};

export function DeliveryRiskBadge({ order }: { order: Order }) {
  const risk = getDeliveryRisk(order);
  const config = riskConfig[risk];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium border gap-1", config.className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
