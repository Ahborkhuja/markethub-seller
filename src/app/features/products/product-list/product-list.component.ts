import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models';
import {
  selectAllProducts,
  selectProductsLoading,
} from '../../../store/products/product.selectors';
import * as ProductActions from '../../../store/products/product.actions';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>My Products</h1>
        <a routerLink="/products/new" class="btn-primary">+ Add Product</a>
      </div>

      <div *ngIf="loading$ | async" class="loading">
        Loading products...
      </div>

      <div class="products-table" *ngIf="!(loading$ | async)">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products$ | async">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>\${{ product.price | number:'1.2-2' }}</td>
              <td>
                <span [class]="product.stock < 10 ? 'low-stock' : ''">
                  {{ product.stock }}
                </span>
              </td>
              <td>⭐ {{ product.rating | number:'1.1-1' }}</td>
              <td>
                <span [class]="product.isActive ? 'badge-active' : 'badge-inactive'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/products', product.id, 'edit']" class="btn-edit">Edit</a>
                <button (click)="delete(product.id)" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="(products$ | async)?.length === 0" class="empty">
          No products yet. <a routerLink="/products/new">Add your first product!</a>
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
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { background: #f8f8f8; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-top: 1px solid #eee; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #ff6b35; color: white; border-radius: 4px; text-decoration: none; }
    .btn-edit { padding: 0.4rem 0.75rem; background: #007bff; color: white; border-radius: 4px; text-decoration: none; margin-right: 0.5rem; font-size: 0.875rem; }
    .btn-delete { padding: 0.4rem 0.75rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
    .badge-active { background: #d4edda; color: #155724; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; }
    .badge-inactive { background: #f8d7da; color: #721c24; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; }
    .low-stock { color: #dc3545; font-weight: bold; }
    .empty { padding: 2rem; text-align: center; color: #666; }
    .empty a { color: #ff6b35; }
    .loading { text-align: center; padding: 2rem; color: #666; }
  `],
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.dispatch(ProductActions.deleteProduct({ id }));
    }
  }
}