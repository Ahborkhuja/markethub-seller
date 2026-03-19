import type { OrderActions, Order, OrderStatus } from './order.actions';

export interface OrdersState {
  items: Order[];
  selectedOrderId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialOrdersState: OrdersState = {
  items: [],
  selectedOrderId: null,
  loading: false,
  error: null,
};

export function ordersReducer(state: OrdersState, action: OrderActions): OrdersState {
  switch (action.type) {
    case '[Orders] Load Started':
      return { ...state, loading: true, error: null };
    case '[Orders] Load Succeeded':
      return { ...state, loading: false, items: action.orders, error: null };
    case '[Orders] Load Failed':
      return { ...state, loading: false, error: action.error };
    case '[Orders] Select':
      return { ...state, selectedOrderId: action.orderId };
    case '[Orders] Update Status Started':
      return { ...state, loading: true, error: null };
    case '[Orders] Update Status Succeeded':
      return {
        ...state,
        loading: false,
        items: state.items.map((o) => (o.id === action.order.id ? action.order : o)),
        error: null,
      };
    case '[Orders] Update Status Failed':
      return { ...state, loading: false, error: action.error };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

// Re-export for consumers that prefer importing from reducer.
export type { Order, OrderStatus };

