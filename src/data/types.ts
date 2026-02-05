export type OrderStatus =
  | "pending"
  | "confirmed"
  | "on_hold"
  | "preparing"
  | "ready"
  | "in_transit"
  | "delivered"
  | "incident"
  | "closed"
  | "returned"
  | "rejected";

export type Channel = "ecommerce" | "marketplace" | "store" | "call_center";

export interface OrderProduct {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  masterId: string;
  customer: Customer;
  channel: Channel;
  status: OrderStatus;
  products: OrderProduct[];
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  tracking?: string;
  carrier?: string;
  notes?: string;
  /** SLA: promised delivery date ISO string */
  promisedDeliveryDate?: string;
  /** Actual delivery date ISO string (filled when delivered) */
  actualDeliveryDate?: string;
  /** Estimated days to deliver from creation */
  estimatedDays?: number;
}

export interface Stage {
  id: string;
  name: string;
  icon: string;
  color: string;
  statuses: OrderStatus[];
}
