import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  collapsed = false;

  constructor(private auth: AuthService) {}

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.auth.logout();
  }
}

