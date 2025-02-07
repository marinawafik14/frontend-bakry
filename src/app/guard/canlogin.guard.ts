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
    const router= inject(Router)
router.navigateByUrl("/login")
    return false;
  }
  return false;

};

