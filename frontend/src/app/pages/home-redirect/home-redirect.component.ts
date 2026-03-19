import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  template: ``,
})
export class HomeRedirectComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (!user) return;
      this.router.navigateByUrl(user.perfil === 'Admin' ? '/monitor' : '/agent/clients');
    });
  }
}

