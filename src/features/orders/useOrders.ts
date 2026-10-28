import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/supabase";
import { getOrders } from "@/services/apiOrders";
import { alertNewOrder } from "@/features/orders/newOrderAlert";

export function useOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // New orders and status changes show up without refreshing the dashboard.
  useEffect(() => {
    const channel = supabase
      .channel("orders-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          if (payload.eventType === "INSERT") alertNewOrder(payload.new.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    orders,
    isLoading,
    error,
  };
}
