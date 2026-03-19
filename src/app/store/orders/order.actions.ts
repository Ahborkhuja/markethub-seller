export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // unit price
}

export interface Order {
  id: string;
  buyerId: string;
  createdAt: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
}

export type OrderActions =
  | { type: '[Orders] Load Started' }
  | { type: '[Orders] Load Succeeded'; orders: Order[] }
  | { type: '[Orders] Load Failed'; error: string }
  | { type: '[Orders] Select'; orderId: string | null }
  | { type: '[Orders] Update Status Started'; orderId: string; status: OrderStatus }
  | { type: '[Orders] Update Status Succeeded'; order: Order }
  | { type: '[Orders] Update Status Failed'; error: string };

export const ordersLoadStarted = (): OrderActions => ({ type: '[Orders] Load Started' });
export const ordersLoadSucceeded = (orders: Order[]): OrderActions => ({ type: '[Orders] Load Succeeded', orders });
export const ordersLoadFailed = (error: string): OrderActions => ({ type: '[Orders] Load Failed', error });
export const ordersSelect = (orderId: string | null): OrderActions => ({ type: '[Orders] Select', orderId });

export const ordersUpdateStatusStarted = (orderId: string, status: OrderStatus): OrderActions => ({
  type: '[Orders] Update Status Started',
  orderId,
  status,
});
export const ordersUpdateStatusSucceeded = (order: Order): OrderActions => ({
  type: '[Orders] Update Status Succeeded',
  order,
});
export const ordersUpdateStatusFailed = (error: string): OrderActions => ({
  type: '[Orders] Update Status Failed',
  error,
});

