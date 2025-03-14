import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const cashierGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const decodedToken = authService.getDecodedToken();
  if (decodedToken?.role === 'Cashier') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};


