export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    isActive: boolean;
    rating: number;
    reviewCount: number;
    sellerId: number;
    createdAt: string;
  }
  
  export interface Order {
    id: number;
    buyerId: number;
    status: OrderStatus;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    // Optional because some order payloads may not include buyer notes.
    notes?: string;
    createdAt: string;
  }
  
  export interface OrderItem {
    id: number;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }
  
  export interface ShippingAddress {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  }
  
  export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';