import { Order, OrderStatus, Channel } from "@/data/types";

export const CSV_HEADERS = [
  "id", "masterId", "customerName", "customerEmail", "customerPhone",
  "channel", "status", "productName", "productSku", "productQty", "productPrice",
  "total", "currency", "createdAt", "updatedAt",
  "tracking", "carrier", "notes",
  "estimatedDays", "promisedDeliveryDate", "actualDeliveryDate",
];

const EXAMPLE_ROWS = [
  [
    "ORD-0001", "MST-100001", "María García", "maria.garcia@email.com", "+56 9 12345678",
    "ecommerce", "in_transit", "Laptop HP Pavilion 15", "SKU-1001", "1", "899990",
    "899990", "CLP", "2026-01-20T10:30:00Z", "2026-01-22T14:00:00Z",
    "TRK-500001", "Chilexpress", "Cliente solicita entrega antes de las 14:00",
    "5", "2026-01-25T23:59:00Z", "",
  ],
  [
    "ORD-0002", "MST-100002", "Carlos López", "carlos.lopez@email.com", "+56 9 87654321",
    "marketplace", "delivered", "iPhone 15 Pro Max", "SKU-2001", "2", "649990",
    "1299980", "CLP", "2026-01-18T08:15:00Z", "2026-01-23T16:45:00Z",
    "TRK-500002", "Starken", "",
    "3", "2026-01-21T23:59:00Z", "2026-01-20T11:30:00Z",
  ],
  [
    "ORD-0003", "MST-100003", "Ana Martínez", "ana.martinez@email.com", "+56 9 55512345",
    "store", "pending", "Samsung Galaxy S24;Funda protectora", "SKU-3001;SKU-3002", "1;2", "499990;15990",
    "531970", "CLP", "2026-02-01T12:00:00Z", "2026-02-01T12:00:00Z",
    "", "", "Pedido con múltiples productos",
    "7", "2026-02-08T23:59:00Z", "",
  ],
];

export function generateCSVTemplate(): string {
  const lines = [CSV_HEADERS.join(",")];
  EXAMPLE_ROWS.forEach((row) => {
    lines.push(row.map((v) => `"${v}"`).join(","));
  });
  return lines.join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCSVToOrders(csvText: string): Order[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const orders: Order[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/("([^"]*)"|[^,]*)/g)?.map((v) => v.replace(/^"|"$/g, "").trim()) || [];
    if (values.length < 10) continue;

    const get = (name: string) => values[headers.indexOf(name)] || "";

    const productNames = get("productName").split(";");
    const skus = get("productSku").split(";");
    const qtys = get("productQty").split(";");
    const prices = get("productPrice").split(";");

    const products = productNames.map((name, pi) => ({
      name,
      sku: skus[pi] || `SKU-AUTO-${pi}`,
      quantity: parseInt(qtys[pi]) || 1,
      price: parseFloat(prices[pi]) || 0,
    }));

    orders.push({
      id: get("id") || `ORD-IMPORT-${i}`,
      masterId: get("masterId") || `MST-IMPORT-${i}`,
      customer: {
        name: get("customerName"),
        email: get("customerEmail"),
        phone: get("customerPhone"),
      },
      channel: (get("channel") as Channel) || "ecommerce",
      status: (get("status") as OrderStatus) || "pending",
      products,
      total: parseFloat(get("total")) || 0,
      currency: get("currency") || "CLP",
      createdAt: get("createdAt") || new Date().toISOString(),
      updatedAt: get("updatedAt") || new Date().toISOString(),
      tracking: get("tracking") || undefined,
      carrier: get("carrier") || undefined,
      notes: get("notes") || undefined,
      estimatedDays: parseInt(get("estimatedDays")) || undefined,
      promisedDeliveryDate: get("promisedDeliveryDate") || undefined,
      actualDeliveryDate: get("actualDeliveryDate") || undefined,
    });
  }

  return orders;
}
