import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService)

  const user = authService.getUser();
  if (user && user.userType === 'ADMIN') {
    return true;
  }
  toastr.error("You don't have access to the admin module", "Access Denied")
  router.navigate(['/']);
  return false;
};
