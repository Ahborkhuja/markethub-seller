import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environments';

export interface OrderNotification {
  type: string;
  orderId: number;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket!: Socket;
  private notifications$ = new Subject<OrderNotification>();

  connect(userId: number): void {
    this.socket = io(`${environment.wsUrl}/notifications`);

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      // Register with userId
      this.socket.emit('register', { userId });
    });

    // Listen for order updates
    this.socket.on('order_update', (data: OrderNotification) => {
      this.notifications$.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });
  }

  getNotifications(): Observable<OrderNotification> {
    return this.notifications$.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}