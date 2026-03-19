import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  const user = auth.user();

  if (!user) return router.parseUrl('/login');
  if (roles.length === 0 || roles.includes(user.perfil)) return true;
  return router.parseUrl('/');
};

