import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import {  inject } from '@angular/core';

export const canloginGuard: CanActivateFn = (route, state) => {
  const accountServ = inject(AccountService);
  if (accountServ.islogin) {
    return true;
  } else {
    const router= inject(Router)
router.navigateByUrl("/login")
    return false;
  }
};
