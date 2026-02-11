import { Order } from "@/data/types";
import { StatusBadge, ChannelBadge } from "./OrderBadges";
import { DeliveryRiskBadge } from "./DeliveryRiskBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Package, Truck, Timer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onConfirmDelivery?: (orderId: string) => void;
}

export function OrderDetail({ order, open, onClose, onConfirmDelivery }: OrderDetailProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <SheetTitle className="font-mono text-lg">{order.id}</SheetTitle>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ChannelBadge channel={order.channel} />
            <span className="text-xs text-muted-foreground">
              Master ID: {order.masterId}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Customer */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Cliente
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="font-medium">{order.customer.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {order.customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                {order.customer.phone}
              </div>
            </div>
          </section>

          <Separator />

          {/* Products */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Package className="w-3.5 h-3.5 inline mr-1" />
              Productos ({order.products.length})
            </h3>
            <div className="space-y-2">
              {order.products.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.sku} · Qty: {p.quantity}</div>
                  </div>
                  <span className="font-mono text-sm">${p.price.toLocaleString("es-CL")}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-mono font-bold text-lg">${order.total.toLocaleString("es-CL")}</span>
            </div>
          </section>

          <Separator />

          {/* Delivery Timing */}
          {order.promisedDeliveryDate && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Timer className="w-3.5 h-3.5 inline mr-1" />
                Tiempos de Entrega
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado de cumplimiento</span>
                  <DeliveryRiskBadge order={order} />
                </div>
                {order.estimatedDays && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Días estimados</span>
                    <span className="font-medium">{order.estimatedDays} días</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha prometida</span>
                  <span className="font-medium">{format(new Date(order.promisedDeliveryDate), "dd MMM yyyy", { locale: es })}</span>
                </div>
                {order.actualDeliveryDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha real de entrega</span>
                    <span className="font-medium">{format(new Date(order.actualDeliveryDate), "dd MMM yyyy", { locale: es })}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <Separator />

          {/* Shipping */}
          {(order.tracking || order.carrier) && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Truck className="w-3.5 h-3.5 inline mr-1" />
                Envío
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {order.carrier && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transportista</span>
                    <span className="font-medium">{order.carrier}</span>
                  </div>
                )}
                {order.tracking && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tracking</span>
                    <span className="font-mono font-medium">{order.tracking}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Confirm Delivery for Store channel */}
          {order.channel === "store" && order.status !== "delivered" && order.status !== "closed" && (
            <section>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => onConfirmDelivery?.(order.id)}
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Entrega en Tienda
              </Button>
            </section>
          )}

          {/* Notes */}
          {order.notes && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Notas
              </h3>
              <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm">
                {order.notes}
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section className="text-xs text-muted-foreground space-y-1">
            <div>Creado: {format(new Date(order.createdAt), "dd MMM yyyy HH:mm", { locale: es })}</div>
            <div>Actualizado: {format(new Date(order.updatedAt), "dd MMM yyyy HH:mm", { locale: es })}</div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
