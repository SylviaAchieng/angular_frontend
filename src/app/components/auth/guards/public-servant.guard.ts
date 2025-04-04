import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const publicServantGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService)

  const user = authService.getUser();
  if (user && user.userType === 'PUBLIC_SERVANT') {
    return true;
  }
  toastr.error("You don't have access to the public servant module", "Access Denied")
  router.navigate(['/']);
  return false;
};
