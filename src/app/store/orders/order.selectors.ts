import type { OrdersState } from './order.reducer';
import type { Order } from './order.actions';

export type OrdersRootSlice = {
  orders: OrdersState;
};

export const selectOrdersState = <T extends OrdersRootSlice>(state: T): OrdersState => state.orders;

export const selectAllOrders = <T extends OrdersRootSlice>(state: T): Order[] => state.orders.items;

export const selectSelectedOrderId = <T extends OrdersRootSlice>(state: T): string | null =>
  state.orders.selectedOrderId;

export const selectSelectedOrder = <T extends OrdersRootSlice>(state: T): Order | null => {
  const id = state.orders.selectedOrderId;
  if (!id) return null;
  return state.orders.items.find((o) => o.id === id) ?? null;
};

export const selectOrdersLoading = <T extends OrdersRootSlice>(state: T): boolean => state.orders.loading;

export const selectOrdersError = <T extends OrdersRootSlice>(state: T): string | null => state.orders.error;

