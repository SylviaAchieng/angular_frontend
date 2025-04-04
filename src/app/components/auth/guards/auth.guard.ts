import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService)

  const user = authService.getUser();
  if (user && user.userType === 'CITIZEN') {
    return true;
  }
  toastr.error("You need to login to access your profile", "Access Denied")
  router.navigate(['/login']);
  return false;
};
