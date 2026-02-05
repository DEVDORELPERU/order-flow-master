import { Order } from "@/data/types";
import { differenceInDays, parseISO, isAfter } from "date-fns";

export type DeliveryRisk = "on_time" | "at_risk" | "late";

export function getDeliveryRisk(order: Order): DeliveryRisk {
  if (!order.promisedDeliveryDate) return "on_time";

  const promised = parseISO(order.promisedDeliveryDate);

  // Already delivered
  if (order.status === "delivered" && order.actualDeliveryDate) {
    const actual = parseISO(order.actualDeliveryDate);
    return isAfter(actual, promised) ? "late" : "on_time";
  }

  // Closed/returned/rejected — no risk
  if (["closed", "returned", "rejected"].includes(order.status)) return "on_time";

  // Still in progress — check if at risk
  const now = new Date();
  const daysLeft = differenceInDays(promised, now);

  if (daysLeft < 0) return "late";
  if (daysLeft <= 1) return "at_risk";
  return "on_time";
}

export function countDeliveryRisks(orders: Order[]) {
  let atRisk = 0;
  let late = 0;
  let onTime = 0;

  orders.forEach((o) => {
    const risk = getDeliveryRisk(o);
    if (risk === "at_risk") atRisk++;
    else if (risk === "late") late++;
    else onTime++;
  });

  return { atRisk, late, onTime, total: atRisk + late };
}
