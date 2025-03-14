import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import {  inject } from '@angular/core';

export const canloginGuard: CanActivateFn = (route, state) => {
  const accountServ = inject(AccountService);
  const router = inject(Router);
  console.log('Auth Guard Triggered');

  // Check if token exists in localStorage
  if (localStorage.getItem('token')) {
    console.log('User is logged in');
    return true;
  } else {
    console.warn('User not logged in. Redirecting to login.');
    router.navigateByUrl("/login");
    return false;
  }
};

