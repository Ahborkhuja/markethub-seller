import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};