import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  collapsed = false;
  mobileOpen = false;
  loggedIn$ = this.auth.loggedIn$;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }

  logout() {
    this.auth.logout();
  }

  login() {
    this.router.navigate(['/login']);
  }
}

