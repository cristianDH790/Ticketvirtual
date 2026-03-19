import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token) return next(req);

  const bearer = `Bearer ${token}`;
  const headerName = environment.authHeaderName ?? 'Authorization';
  return next(req.clone({ setHeaders: { [headerName]: bearer } }));
};
