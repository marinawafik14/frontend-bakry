import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
   const router = inject(Router);
   
   const decodedToken = authService.getDecodedToken();
   if (decodedToken?.role === 'Seller') {
     return true;
   } else {
     router.navigate(['/login']);
     return false;
   }
};
