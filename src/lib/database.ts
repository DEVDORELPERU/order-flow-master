/**
 * Conexión real a SQL Server
 * Tabla: Ordenes
 */

import { Order, OrderStatus, Channel } from "@/data/types";
import { getConnection } from "./db";
import sql from "mssql";

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
  query: string;
}

/**
 * SELECT * FROM Ordenes WHERE ...
 * Consulta real con filtros y paginación (SQL Server)
 */
export async function selectOrdenes(
  filters: QueryFilters = {}
): Promise<QueryResult> {
  const {
    status = "all",
    channel = "all",
    search = "",
    limit = 50,
    offset = 0,
  } = filters;

  const pool = await getConnection();
  const request = pool.request();

  let whereClauses: string[] = [];

  if (status !== "all") {
    whereClauses.push("status = @status");
    request.input("status", sql.VarChar, status);
  }

  if (channel !== "all") {
    whereClauses.push("channel = @channel");
    request.input("channel", sql.VarChar, channel);
  }

  if (search) {
    whereClauses.push(
      "(id LIKE @search OR customer_name LIKE @search OR customer_email LIKE @search)"
    );
    request.input("search", sql.VarChar, `%${search}%`);
  }

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const query = `
    SELECT *
    FROM Ordenes
    ${whereSQL}
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  request.input("offset", sql.Int, offset);
  request.input("limit", sql.Int, limit);

  const result = await request.query(query);

  return {
    data: result.recordset as Order[],
    total: result.recordset.length,
    query,
  };
}

/**
 * SELECT COUNT(*) FROM Ordenes GROUP BY status
 */
export async function countByStatusQuery(): Promise<Record<string, number>> {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT status, COUNT(*) as total
    FROM Ordenes
    GROUP BY status
  `);

  const map: Record<string, number> = {};

  result.recordset.forEach((row: any) => {
    map[row.status] = row.total;
  });

  return map;
}

/**
 * SELECT COUNT(*) FROM Ordenes GROUP BY channel
 */
export async function countByChannelQuery(): Promise<Record<string, number>> {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT channel, COUNT(*) as total
    FROM Ordenes
    GROUP BY channel
  `);

  const map: Record<string, number> = {};

  result.recordset.forEach((row: any) => {
    map[row.channel] = row.total;
  });

  return map;
}

/**
 * UPDATE Ordenes SET status = 'delivered'
 */
export async function updateDeliveryStatus(
  orderId: string
): Promise<Order | null> {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("orderId", sql.VarChar, orderId)
    .query(`
      UPDATE Ordenes
      SET status = 'delivered',
          actual_delivery_date = GETDATE()
      OUTPUT inserted.*
      WHERE id = @orderId
    `);

  return result.recordset[0] || null;
}

/**
 * SELECT * FROM Ordenes (sin filtros)
 */
export async function selectAllOrdenes(): Promise<Order[]> {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT *
    FROM Ordenes
  `);

  return result.recordset as Order[];
}
