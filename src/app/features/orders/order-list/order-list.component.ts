import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Order, OrderStatus } from '../../../core/models';
import { environment } from '../../../../environments/environments';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner [show]="loading" message="Loading orders...">
    </app-loading-spinner>

    <div class="page">
      <div class="page-header">
        <h1>Orders</h1>
        <div class="filters">
          <select (change)="filterByStatus($event)">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>#{{ order.id }}</td>
              <td>{{ order.createdAt | date:'mediumDate' }}</td>
              <td>{{ order.items?.length || 0 }} items</td>
              <td>\${{ order.totalAmount | number:'1.2-2' }}</td>
              <td>
                <span [class]="'badge-' + order.status">
                  {{ order.status | titlecase }}
                </span>
              </td>
              <td>
                <span [class]="'payment-' + order.paymentStatus">
                  {{ order.paymentStatus | titlecase }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/orders', order.id]" class="btn-view">
                  View
                </a>
                <select
                  *ngIf="canUpdateStatus(order.status)"
                  (change)="updateStatus(order.id, $event)"
                  class="status-select"
                >
                  <option value="">Update status</option>
                  <option
                    *ngFor="let s of getNextStatuses(order.status)"
                    [value]="s"
                  >{{ s | titlecase }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredOrders.length === 0 && !loading" class="empty">
          No orders found.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .filters select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th {
      background: #f8f8f8;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }
    td { padding: 1rem; border-top: 1px solid #eee; }
    .badge-pending   { background: #fff3cd; color: #856404; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-confirmed { background: #cce5ff; color: #004085; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-processing{ background: #d1ecf1; color: #0c5460; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-shipped   { background: #d4edda; color: #155724; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-delivered { background: #d4edda; color: #155724; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-cancelled { background: #f8d7da; color: #721c24; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
    .payment-pending { color: #856404; }
    .payment-paid    { color: #155724; font-weight: 500; }
    .payment-failed  { color: #721c24; }
    .btn-view {
      padding: 0.4rem 0.75rem;
      background: #007bff;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }
    .status-select {
      padding: 0.4rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .empty { padding: 2rem; text-align: center; color: #666; }
  `],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;

  private statusTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
      next: orders => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  filterByStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.filteredOrders = status
      ? this.orders.filter(o => o.status === status)
      : this.orders;
  }

  canUpdateStatus(status: OrderStatus): boolean {
    return this.statusTransitions[status]?.length > 0;
  }

  getNextStatuses(status: OrderStatus): string[] {
    return this.statusTransitions[status] || [];
  }

  updateStatus(orderId: number, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (!status) return;

    this.http
      .patch(`${environment.apiUrl}/orders/${orderId}/status`, { status })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error(err),
      });
  }
}