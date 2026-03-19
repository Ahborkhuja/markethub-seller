import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductActions from '../../../store/products/product.actions';
import { selectProductsLoading } from '../../../store/products/product.selectors';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <a routerLink="/products" class="back-btn">← Back to Products</a>
        <h1>{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h1>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                formControlName="name"
                placeholder="iPhone 15 Pro"
              />
              <span class="error"
                *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
                Name is required
              </span>
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select formControlName="category">
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Home">Home & Garden</option>
                <option value="Beauty">Beauty</option>
                <option value="Other">Other</option>
              </select>
              <span class="error"
                *ngIf="form.get('category')?.errors?.['required'] && form.get('category')?.touched">
                Category is required
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea
              formControlName="description"
              placeholder="Describe your product..."
              rows="4"
            ></textarea>
            <span class="error"
              *ngIf="form.get('description')?.errors?.['required'] && form.get('description')?.touched">
              Description is required
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                formControlName="price"
                placeholder="99.99"
                min="0"
                step="0.01"
              />
              <span class="error"
                *ngIf="form.get('price')?.errors?.['min'] && form.get('price')?.touched">
                Price must be greater than 0
              </span>
            </div>

            <div class="form-group">
              <label>Stock *</label>
              <input
                type="number"
                formControlName="stock"
                placeholder="100"
                min="0"
              />
              <span class="error"
                *ngIf="form.get('stock')?.errors?.['min'] && form.get('stock')?.touched">
                Stock cannot be negative
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>Image URLs (one per line)</label>
            <textarea
              formControlName="images"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows="3"
            ></textarea>
            <small>Enter each image URL on a new line</small>
          </div>

          <div class="form-actions">
            <a routerLink="/products" class="btn-cancel">Cancel</a>
            <button
              type="submit"
              class="btn-submit"
              [disabled]="form.invalid || (loading$ | async)"
            >
              {{ (loading$ | async) ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .back-btn { color: #ff6b35; text-decoration: none; font-size: 0.9rem; }
    h1 { margin-top: 0.5rem; }
    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group { margin-bottom: 1.5rem; }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #ff6b35;
    }
    small { color: #999; font-size: 0.8rem; }
    .error { color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; display: block; }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn-cancel {
      padding: 0.75rem 2rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-decoration: none;
      color: #666;
    }
    .btn-submit {
      padding: 0.75rem 2rem;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
  `],
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;

  loading$: Observable<boolean>;
  isEdit = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {
      this.form = this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          price: [0, [Validators.required, Validators.min(0.01)]],
          stock: [0, [Validators.required, Validators.min(0)]],
          category: ['', Validators.required],
        images: [''],
    });
    this.loading$ = this.store.select(selectProductsLoading);
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, description, price, stock, category, images } = this.form.value;

      const imageList = images
        ? images.split('\n').map((url: string) => url.trim()).filter(Boolean)
        : [];

      const product = {
        name: name!,
        description: description!,
        price: price!,
        stock: stock!,
        category: category!,
        images: imageList,
      };

      if (this.isEdit && this.productId) {
        this.store.dispatch(
          ProductActions.updateProduct({ id: this.productId, product })
        );
      } else {
        this.store.dispatch(ProductActions.createProduct({ product }));
      }

      this.router.navigate(['/products']);
    }
  }
}