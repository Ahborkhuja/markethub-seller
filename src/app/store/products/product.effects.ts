import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, switchMap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(ApiService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.apiService.get<{ data: { products: { items: Product[] } } }>('/products').pipe(
          map(response =>
            ProductActions.loadProductsSuccess({
              products: response.data.products.items,
            })
          ),
          catchError(error =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          ),
        )
      ),
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      exhaustMap(({ product }) =>
        this.apiService.post<{ data: { createProduct: Product } }>('/products', product).pipe(
          map(response =>
            ProductActions.createProductSuccess({
              product: response.data.createProduct,
            })
          ),
          catchError(error =>
            of(ProductActions.createProductFailure({ error: error.message }))
          ),
        )
      ),
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      exhaustMap(({ id }) =>
        this.apiService.delete(`/products/${id}`).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError(error =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          ),
        )
      ),
    )
  );
}