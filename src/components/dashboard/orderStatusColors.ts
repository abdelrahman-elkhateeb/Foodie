import type { OrderStatus } from "@/types/OrderTypes";

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-status-pending",
  preparing: "bg-status-preparing",
  out_for_delivery: "bg-status-delivering",
  delivered: "bg-status-delivered",
};
