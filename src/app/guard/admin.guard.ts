import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
     const router = inject(Router);
     
     const decodedToken = authService.getDecodedToken();
     if (decodedToken?.role === 'Admin') {
       return true;
     } else {
       router.navigate(['/login']);
       return false;
     }
};
