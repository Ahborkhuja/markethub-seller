import { createAction, props } from '@ngrx/store';
import { Product } from '../../core/models';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const createProduct = createAction(
  '[Products] Create Product',
  props<{ product: Partial<Product> }>()
);

export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: string }>()
);

export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: string; product: Partial<Product> }>()
);

export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);

export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ id: string }>()
);

export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: string }>()
);