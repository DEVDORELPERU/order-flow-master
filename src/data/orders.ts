import { Order, OrderStatus, Channel, Stage } from "./types";

export const STAGES: Stage[] = [
  {
    id: "capture",
    name: "Captura",
    icon: "📥",
    color: "stage-capture",
    statuses: ["pending"],
  },
  {
    id: "verification",
    name: "Verificación",
    icon: "✅",
    color: "stage-verification",
    statuses: ["confirmed", "on_hold"],
  },
  {
    id: "fulfillment",
    name: "Preparación",
    icon: "📦",
    color: "stage-fulfillment",
    statuses: ["preparing", "ready"],
  },
  {
    id: "shipping",
    name: "Despacho",
    icon: "🚚",
    color: "stage-shipping",
    statuses: ["in_transit", "delivered", "incident"],
  },
  {
    id: "postsale",
    name: "Postventa",
    icon: "🏁",
    color: "stage-postsale",
    statuses: ["closed", "returned"],
  },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  on_hold: "En espera",
  preparing: "En preparación",
  ready: "Listo para despacho",
  in_transit: "En tránsito",
  delivered: "Entregado",
  incident: "Incidencia",
  closed: "Cerrado",
  returned: "Devuelto",
  rejected: "Rechazado",
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  ecommerce: "E-Commerce",
  marketplace: "Marketplace",
  store: "Tienda Física",
  call_center: "Call Center",
};

const names = [
  "María García", "Carlos López", "Ana Martínez", "Jorge Ramírez",
  "Lucía Fernández", "Diego Morales", "Camila Torres", "Andrés Vargas",
  "Valentina Rojas", "Sebastián Castro", "Paula Herrera", "Mateo Silva",
  "Isabella Cruz", "Santiago Ortiz", "Daniela Reyes", "Nicolás Méndez",
];

const products = [
  ["Laptop HP Pavilion 15", "Mouse Logitech MX"],
  ["iPhone 15 Pro Max"],
  ["Samsung Galaxy S24", "Funda protectora", "Cargador rápido"],
  ["Auriculares Sony WH-1000XM5"],
  ["Monitor LG UltraWide 34\""],
  ["Teclado mecánico Keychron K8"],
  ["iPad Air M2", "Apple Pencil"],
  ["Cámara Canon EOS R50"],
  ["Disco SSD Samsung 1TB"],
  ["Impresora Epson L3250"],
];

const channels: Channel[] = ["ecommerce", "marketplace", "store", "call_center"];
const statuses: OrderStatus[] = [
  "pending", "confirmed", "on_hold", "preparing", "ready",
  "in_transit", "delivered", "incident", "closed", "returned", "rejected",
];

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const MOCK_ORDERS: Order[] = Array.from({ length: 48 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const channel = channels[i % channels.length];
  const orderProducts = products[i % products.length];
  const total = Math.round((Math.random() * 2000 + 50) * 100) / 100;

  return {
    id: `ORD-${String(2024000 + i).padStart(7, "0")}`,
    masterId: `MST-${String(100000 + i)}`,
    customer: {
      name: names[i % names.length],
      email: `${names[i % names.length].toLowerCase().replace(/ /g, ".")}@email.com`,
      phone: `+56 9 ${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
    },
    channel,
    status,
    products: orderProducts.map((name, pi) => ({
      name,
      sku: `SKU-${String(1000 + i * 10 + pi)}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.round((total / orderProducts.length) * 100) / 100,
    })),
    total,
    currency: "CLP",
    createdAt: randomDate(30),
    updatedAt: randomDate(5),
    tracking: status === "in_transit" || status === "delivered" ? `TRK-${String(500000 + i)}` : undefined,
    carrier: status === "in_transit" || status === "delivered" ? ["Chilexpress", "Starken", "Blue Express"][i % 3] : undefined,
    notes: i % 5 === 0 ? "Cliente solicita entrega antes de las 14:00" : undefined,
    estimatedDays: [3, 5, 7, 2, 4, 6, 1, 8, 3, 5][i % 10],
    promisedDeliveryDate: (() => {
      const d = new Date(randomDate(30));
      const est = [3, 5, 7, 2, 4, 6, 1, 8, 3, 5][i % 10];
      d.setDate(d.getDate() + est);
      return d.toISOString();
    })(),
    actualDeliveryDate: status === "delivered" ? (() => {
      const d = new Date(randomDate(30));
      const est = [3, 5, 7, 2, 4, 6, 1, 8, 3, 5][i % 10];
      // Some delivered on time, some late
      d.setDate(d.getDate() + est + (i % 3 === 0 ? 2 : -1));
      return d.toISOString();
    })() : undefined,
  };
});
