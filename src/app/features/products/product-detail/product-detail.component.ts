import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Product } from '../../../core/models';
import { selectAllProducts } from '../../../store/products/product.selectors';
import * as ProductActions from '../../../store/products/product.actions';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page" *ngIf="product$ | async as product; else loading">
      <div class="page-header">
        <a routerLink="/products" class="back-btn">← Back to Products</a>
        <div class="header-actions">
          <a [routerLink]="['/products', product.id, 'edit']" class="btn-edit">
            Edit Product
          </a>
        </div>
      </div>

      <div class="product-detail">
        <!-- Images -->
        <div class="product-images">
          <img
            *ngIf="product && product.images && product.images.length > 0; else noImage"
            [src]="product.images[0]"
            [alt]="product.name"
            class="main-image"
          />
          <ng-template #noImage>
            <div class="no-image">📦 No Image</div>
          </ng-template>

          <div class="image-thumbnails">
            <img
              *ngFor="let img of product && product.images && product.images.slice(1)"
              [src]="img"
              [alt]="product.name"
              class="thumbnail"
            />
          </div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <div class="product-status">
            <span [class]="product.isActive ? 'badge-active' : 'badge-inactive'">
              {{ product.isActive ? '● Active' : '● Inactive' }}
            </span>
            <span class="category-badge">{{ product.category }}</span>
          </div>

          <h1>{{ product.name }}</h1>

          <div class="product-rating">
            <span class="stars">⭐ {{ product.rating | number:'1.1-1' }}</span>
            <span class="reviews">({{ product.reviewCount }} reviews)</span>
          </div>

          <div class="product-price">\${{ product.price | number:'1.2-2' }}</div>

          <div class="product-stock">
            <span [class]="product.stock < 10 ? 'stock-low' : 'stock-ok'">
              {{ product.stock < 10 ? '⚠️' : '✅' }}
              {{ product.stock }} units in stock
            </span>
          </div>

          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">Product ID</span>
              <span class="meta-value">{{ product.id }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Created</span>
              <span class="meta-value">{{ product.createdAt | date:'mediumDate' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">Loading product...</div>
    </ng-template>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .back-btn { color: #ff6b35; text-decoration: none; }
    .btn-edit {
      padding: 0.75rem 1.5rem;
      background: #ff6b35;
      color: white;
      border-radius: 4px;
      text-decoration: none;
    }
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .main-image {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
      max-height: 400px;
    }
    .no-image {
      width: 100%;
      height: 300px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      border-radius: 8px;
    }
    .image-thumbnails {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
    }
    .product-status {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .badge-active {
      background: #d4edda;
      color: #155724;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }
    .badge-inactive {
      background: #f8d7da;
      color: #721c24;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }
    .category-badge {
      background: #e2e8f0;
      color: #4a5568;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }
    h1 { font-size: 1.75rem; margin: 0.5rem 0; }
    .product-rating { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
    .stars { font-size: 1.1rem; }
    .reviews { color: #666; font-size: 0.9rem; }
    .product-price { font-size: 2rem; font-weight: bold; color: #ff6b35; margin-bottom: 1rem; }
    .product-stock { margin-bottom: 1.5rem; }
    .stock-low { color: #dc3545; }
    .stock-ok { color: #28a745; }
    .product-description h3 { margin-bottom: 0.5rem; }
    .product-description p { color: #555; line-height: 1.6; }
    .product-meta { margin-top: 1.5rem; border-top: 1px solid #eee; padding-top: 1rem; }
    .meta-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .meta-label { color: #666; font-size: 0.9rem; }
    .meta-value { font-weight: 500; font-size: 0.9rem; }
    .loading { text-align: center; padding: 4rem; color: #666; }
  `],
})
export class ProductDetailComponent implements OnInit {
  product$?: Observable<Product | undefined>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(ProductActions.loadProducts());
    this.product$ = this.store.select(selectAllProducts).pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}