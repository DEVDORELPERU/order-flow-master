/**
 * Simulación de conexión a base de datos SQL
 * Tabla: Ordenes
 * 
 * Simula queries SQL asíncronos contra una tabla "Ordenes"
 * con latencia artificial para emular una conexión real.
 */

import { Order, OrderStatus, Channel } from "@/data/types";
import { MOCK_ORDERS } from "@/data/orders";

// Simula la tabla "Ordenes" en memoria (como si fuera PostgreSQL)
let tablaOrdenes: Order[] = [...MOCK_ORDERS];

/** Latencia simulada de red/DB en ms */
const DB_LATENCY = 400;

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, DB_LATENCY));
}

export interface QueryFilters {
  status?: OrderStatus | "all";
  channel?: Channel | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface QueryResult {
  data: Order[];
  total: number;
  query: string; // SQL simulado para debug
}

/**
 * SELECT * FROM Ordenes WHERE ...
 * Simula una consulta SQL con filtros, paginación y búsqueda.
 */
export async function selectOrdenes(filters: QueryFilters = {}): Promise<QueryResult> {
  await simulateLatency();

  const { status = "all", channel = "all", search = "", limit = 50, offset = 0 } = filters;

  // Construir SQL simulado para logging
  const whereClauses: string[] = [];
  if (status !== "all") whereClauses.push(`status = '${status}'`);
  if (channel !== "all") whereClauses.push(`channel = '${channel}'`);
  if (search) whereClauses.push(`(id ILIKE '%${search}%' OR customer_name ILIKE '%${search}%' OR customer_email ILIKE '%${search}%')`);

  const whereSQL = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(" AND ")}` : "";
  const query = `SELECT * FROM Ordenes${whereSQL} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  // Ejecutar filtrado en memoria (simula el motor SQL)
  let results = tablaOrdenes.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (channel !== "all" && o.channel !== channel) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = results.length;
  results = results.slice(offset, offset + limit);

  console.log(`[DB] ${query} → ${total} registros`);

  return { data: results, total, query };
}

/**
 * SELECT COUNT(*) FROM Ordenes GROUP BY status
 */
export async function countByStatusQuery(): Promise<Record<string, number>> {
  await simulateLatency();

  const map: Record<string, number> = {};
  tablaOrdenes.forEach((o) => {
    map[o.status] = (map[o.status] || 0) + 1;
  });

  console.log("[DB] SELECT status, COUNT(*) FROM Ordenes GROUP BY status");
  return map;
}

/**
 * SELECT COUNT(*) FROM Ordenes GROUP BY channel
 */
export async function countByChannelQuery(): Promise<Record<string, number>> {
  await simulateLatency();

  const map: Record<string, number> = {};
  tablaOrdenes.forEach((o) => {
    map[o.channel] = (map[o.channel] || 0) + 1;
  });

  console.log("[DB] SELECT channel, COUNT(*) FROM Ordenes GROUP BY channel");
  return map;
}

/**
 * UPDATE Ordenes SET status = 'delivered', actual_delivery_date = NOW() WHERE id = ?
 */
export async function updateDeliveryStatus(orderId: string): Promise<Order | null> {
  await simulateLatency();

  const query = `UPDATE Ordenes SET status = 'delivered', actual_delivery_date = NOW() WHERE id = '${orderId}'`;
  console.log(`[DB] ${query}`);

  let updated: Order | null = null;
  tablaOrdenes = tablaOrdenes.map((o) => {
    if (o.id === orderId) {
      updated = { ...o, status: "delivered" as OrderStatus, actualDeliveryDate: new Date().toISOString() };
      return updated;
    }
    return o;
  });

  return updated;
}

/**
 * SELECT * FROM Ordenes (sin filtros, para KPIs)
 */
export async function selectAllOrdenes(): Promise<Order[]> {
  await simulateLatency();
  console.log("[DB] SELECT * FROM Ordenes");
  return [...tablaOrdenes];
}
