import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../../core/models';
import { environment } from '../../../../environments/environments';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner [show]="loading" message="Loading order...">
    </app-loading-spinner>

    <div class="page" *ngIf="order && !loading">
      <div class="page-header">
        <a routerLink="/orders" class="back-btn">← Back to Orders</a>
        <h1>Order #{{ order.id }}</h1>
      </div>

      <!-- Status Timeline -->
      <div class="status-timeline">
        <div
          *ngFor="let step of statusSteps"
          class="step"
          [class.completed]="isCompleted(step.status)"
          [class.current]="order.status === step.status"
        >
          <div class="step-icon">{{ step.icon }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <div class="order-grid">
        <!-- Order Items -->
        <div class="card">
          <h2>Items Ordered</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of order.items">
                <td>{{ item.productName }}</td>
                <td>\${{ item.price | number:'1.2-2' }}</td>
                <td>{{ item.quantity }}</td>
                <td>\${{ item.subtotal | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">Total</td>
                <td class="total-amount">
                  \${{ order.totalAmount | number:'1.2-2' }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Order Info -->
        <div class="side-cards">
          <!-- Shipping Address -->
          <div class="card">
            <h2>📍 Shipping Address</h2>
            <p>{{ order.shippingAddress?.street }}</p>
            <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.zipCode }}</p>
            <p>{{ order.shippingAddress?.country }}</p>
          </div>

          <!-- Order Status -->
          <div class="card">
            <h2>📋 Order Info</h2>
            <div class="info-row">
              <span>Status</span>
              <span [class]="'badge-' + order.status">
                {{ order.status | titlecase }}
              </span>
            </div>
            <div class="info-row">
              <span>Payment</span>
              <span>{{ order.paymentStatus | titlecase }}</span>
            </div>
            <div class="info-row">
              <span>Ordered</span>
              <span>{{ order.createdAt | date:'medium' }}</span>
            </div>
            <div class="info-row" *ngIf="order.notes">
              <span>Notes</span>
              <span>{{ order?.notes }}</span>
            </div>
          </div>

          <!-- Update Status -->
          <div class="card" *ngIf="nextStatuses.length > 0">
            <h2>🔄 Update Status</h2>
            <div *ngFor="let status of nextStatuses">
              <button
                class="btn-status"
                (click)="updateStatus(status)"
              >
                Move to {{ status | titlecase }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .back-btn { color: #ff6b35; text-decoration: none; }

    /* Timeline */
    .status-timeline {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      position: relative;
    }
    .status-timeline::before {
      content: '';
      position: absolute;
      top: 2rem;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #eee;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      z-index: 1;
    }
    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .step.completed .step-icon { background: #28a745; }
    .step.current .step-icon { background: #ff6b35; }
    .step-label { font-size: 0.75rem; color: #666; text-align: center; }
    .step.current .step-label { color: #ff6b35; font-weight: bold; }

    /* Grid */
    .order-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 1.5rem;
    }
    .side-cards { display: flex; flex-direction: column; gap: 1rem; }
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card h2 { margin-bottom: 1rem; font-size: 1.1rem; }

    /* Table */
    table { width: 100%; border-collapse: collapse; }
    th {
      background: #f8f8f8;
      padding: 0.75rem;
      text-align: left;
      font-size: 0.9rem;
    }
    td { padding: 0.75rem; border-top: 1px solid #eee; }
    tfoot td { border-top: 2px solid #ddd; font-weight: bold; }
    .total-label { text-align: right; color: #666; }
    .total-amount { color: #ff6b35; font-size: 1.1rem; }

    /* Info rows */
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f5f5f5;
      font-size: 0.9rem;
    }
    .info-row span:first-child { color: #666; }

    /* Badges */
    .badge-pending   { background: #fff3cd; color: #856404; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-confirmed { background: #cce5ff; color: #004085; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-processing{ background: #d1ecf1; color: #0c5460; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-shipped   { background: #d4edda; color: #155724; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-delivered { background: #d4edda; color: #155724; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }
    .badge-cancelled { background: #f8d7da; color: #721c24; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }

    .btn-status {
      width: 100%;
      padding: 0.75rem;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .btn-status:hover { background: #e55a27; }
  `],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;

  statusSteps = [
    { status: 'pending', label: 'Pending', icon: '🕐' },
    { status: 'confirmed', label: 'Confirmed', icon: '✅' },
    { status: 'processing', label: 'Processing', icon: '⚙️' },
    { status: 'shipped', label: 'Shipped', icon: '📦' },
    { status: 'delivered', label: 'Delivered', icon: '🎉' },
  ];

  statusTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  get nextStatuses(): string[] {
    return this.statusTransitions[this.order?.status || ''] || [];
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.http
      .get<Order>(`${environment.apiUrl}/orders/${id}`)
      .subscribe({
        next: order => {
          this.order = order;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  isCompleted(status: string): boolean {
    const order = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = order.indexOf(this.order?.status || '');
    const stepIndex = order.indexOf(status);
    return stepIndex < currentIndex;
  }

  updateStatus(status: string): void {
    if (!this.order) return;

    this.http
      .patch(`${environment.apiUrl}/orders/${this.order.id}/status`, { status })
      .subscribe({
        next: (updated: any) => {
          this.order = updated;
        },
      });
  }
}