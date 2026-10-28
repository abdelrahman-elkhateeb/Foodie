import supabase from "@/lib/supabase";
import type {
  CreateOrderData,
  Order,
  OrderStatus,
} from "@/types/OrderTypes";

const ORDER_SELECT =
  "*, order_items(id, order_id, product_id, quantity, price, products(name_en, name_ar, image_url))";

export async function getOrder(orderId: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

// Prices and the total are calculated in the database (see place_order in
// supabase/migrations) so they can't be tampered with from the browser.
export async function createOrder({
  customer_name,
  phone,
  address,
  payment_method,
  items,
}: CreateOrderData): Promise<Order> {
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: customer_name,
    p_phone: phone,
    p_address: address,
    p_payment_method: payment_method,
    p_items: items,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function updateOrderStatus({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}): Promise<Order> {
  const { data, error } = await supabase.rpc("update_order_status", {
    p_order_id: orderId,
    p_status: status,
  });

  if (error) throw new Error(error.message);

  return data;
}
