import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { productReducer } from './store/products/product.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { ProductEffects } from './store/products/product.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // NgRx Store
    provideStore({
      auth: authReducer,
      products: productReducer,
    }),

    // NgRx Effects
    provideEffects([AuthEffects, ProductEffects]),

    // DevTools
    provideStoreDevtools({ maxAge: 25 }),
  ],
};