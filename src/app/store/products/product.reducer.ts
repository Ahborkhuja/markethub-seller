import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../../core/models';
import * as ProductActions from './product.actions';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

const initialState: ProductState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, state => ({
    ...state, loading: true, error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, { ...state, loading: false })
  ),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),

  on(ProductActions.createProductSuccess, (state, { product }) =>
    adapter.addOne(product, state)
  ),

  on(ProductActions.updateProductSuccess, (state, { product }) =>
    adapter.upsertOne(product, state)
  ),

  on(ProductActions.deleteProductSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  ),
);

export const { selectAll, selectEntities } = adapter.getSelectors();