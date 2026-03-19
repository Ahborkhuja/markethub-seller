import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState, selectAll } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState, selectAll
);

export const selectProductsLoading = createSelector(
  selectProductState, state => state.loading
);

export const selectProductsError = createSelector(
  selectProductState, state => state.error
);

export const selectProductCount = createSelector(
  selectAllProducts, products => products.length
);