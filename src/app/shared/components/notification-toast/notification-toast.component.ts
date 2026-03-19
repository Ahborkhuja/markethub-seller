import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderNotification } from '../../../core/services/websocket.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    <div class="toast-container">
      <div
        class="toast"
        *ngFor="let notification of notifications"
        [@slideIn]
        [class]="getClass(notification.type)"
      >
        <div class="toast-icon">{{ getIcon(notification.type) }}</div>
        <div class="toast-content">
          <p class="toast-message">{{ notification.message }}</p>
          <small>{{ notification.timestamp | date:'shortTime' }}</small>
        </div>
        <button class="toast-close" (click)="dismiss.emit(notification)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 350px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background: white;
      border-left: 4px solid #ff6b35;
    }
    .toast.success { border-left-color: #28a745; }
    .toast.warning { border-left-color: #ffc107; }
    .toast.danger  { border-left-color: #dc3545; }
    .toast.info    { border-left-color: #17a2b8; }
    .toast-icon { font-size: 1.5rem; }
    .toast-content { flex: 1; }
    .toast-message { margin: 0; font-size: 0.9rem; font-weight: 500; }
    small { color: #999; font-size: 0.75rem; }
    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      line-height: 1;
    }
    .toast-close:hover { color: #333; }
  `],
})
export class NotificationToastComponent {
  @Input() notifications: OrderNotification[] = [];
  @Output() dismiss = new EventEmitter<OrderNotification>();

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      ORDER_CREATED: '🎉',
      ORDER_CONFIRMED: '✅',
      ORDER_PROCESSING: '⚙️',
      ORDER_SHIPPED: '📦',
      ORDER_DELIVERED: '🎁',
      ORDER_CANCELLED: '❌',
    };
    return icons[type] || '🔔';
  }

  getClass(type: string): string {
    const classes: Record<string, string> = {
      ORDER_CREATED: 'success',
      ORDER_CONFIRMED: 'info',
      ORDER_PROCESSING: 'info',
      ORDER_SHIPPED: 'warning',
      ORDER_DELIVERED: 'success',
      ORDER_CANCELLED: 'danger',
    };
    return classes[type] || '';
  }
}