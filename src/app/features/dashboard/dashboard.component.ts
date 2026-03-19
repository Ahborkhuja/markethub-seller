import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectUser } from '../../store/auth/auth.selectors';
import {
  selectAllProducts,
  selectProductCount,
} from '../../store/products/product.selectors';
import * as ProductActions from '../../store/products/product.actions';
import * as AuthActions from '../../store/auth/auth.actions';
import { WebsocketService, OrderNotification } from '../../core/services/websocket.service';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models';
import { NotificationToastComponent } from '../../shared/components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationToastComponent],
  template: `
    <div class="dashboard">
      <!-- Navbar -->
      <nav class="navbar">
        <span class="brand">🛒 MarketHub Seller</span>
        <div class="nav-links">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/products">Products</a>
          <a routerLink="/orders">Orders</a>
          <button (click)="logout()">Logout</button>
        </div>
      </nav>

      <!-- Notifications -->
      <div class="notifications" *ngIf="notifications.length > 0">
        <div
          class="notification"
          *ngFor="let n of notifications"
          [class]="n.type.toLowerCase()"
        >
          🔔 {{ n.message }}
        </div>
        <app-notification-toast
  [notifications]="notifications"
  (dismiss)="dismissNotification($event)"
>
</app-notification-toast>
      </div>

      <!-- Stats -->
      <div class="content">
        <h1>Welcome back, {{ (user$ | async)?.name }}! 👋</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Products</h3>
            <p class="stat-number">{{ productCount$ | async }}</p>
            <a routerLink="/products">View all →</a>
          </div>
          <div class="stat-card">
            <h3>Active Listings</h3>
            <p class="stat-number">{{ activeProducts$ | async }}</p>
          </div>
          <div class="stat-card">
            <h3>Notifications</h3>
            <p class="stat-number">{{ notifications.length }}</p>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <a routerLink="/products/new" class="btn-primary">
            + Add New Product
          </a>
          <a routerLink="/orders" class="btn-secondary">
            View Orders
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f5f5f5; }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .brand { font-size: 1.25rem; font-weight: bold; color: #ff6b35; }
    .nav-links { display: flex; gap: 1rem; align-items: center; }
    .nav-links a { text-decoration: none; color: #333; }
    .nav-links button {
      padding: 0.5rem 1rem;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 2rem 0;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-card h3 { color: #666; margin-bottom: 0.5rem; }
    .stat-number { font-size: 2rem; font-weight: bold; color: #ff6b35; }
    .stat-card a { color: #ff6b35; text-decoration: none; font-size: 0.875rem; }
    .quick-actions { display: flex; gap: 1rem; align-items: center; }
    .quick-actions h2 { margin-right: 1rem; }
    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #ff6b35;
      color: white;
      border-radius: 4px;
      text-decoration: none;
    }
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ff6b35;
      color: #ff6b35;
      border-radius: 4px;
      text-decoration: none;
    }
    .notifications { padding: 1rem 2rem; }
    .notification {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: #d4edda;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  productCount$: Observable<number>;
  activeProducts$: Observable<number>;

  notifications: OrderNotification[] = [];
  private wsSub: Subscription = new Subscription();

  constructor(
    private store: Store,
    private wsService: WebsocketService,
  ) {
    this.user$ = this.store.select(selectUser);
    this.productCount$ = this.store.select(selectProductCount);
    this.activeProducts$ = this.store.select(
      (state: any) => state.products.ids.length
    );
  }

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());

    // Connect WebSocket
    const userId =
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('user') || '{}')?.id
        : null;
    if (userId) {
      this.wsService.connect(userId);
      this.wsSub = this.wsService.getNotifications().subscribe(notification => {
        this.notifications.unshift(notification); // newest first
        if (this.notifications.length > 5) {
          this.notifications.pop(); // keep only 5
        }
      });
    }
  }

  dismissNotification(notification: OrderNotification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  ngOnDestroy(): void {
    this.wsSub.unsubscribe();
    this.wsService.disconnect();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}