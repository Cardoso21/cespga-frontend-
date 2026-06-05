import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';

const PAGE_TITLES: Record<string, string> = {
  'dashboard':  'Dashboard',
  'mediuns':    'Médiuns',
  'agenda':     'Agenda',
  'fotos':      'Fotos',
  'cargos':     'Cargos',
  'usuarios':   'Usuários',
  'login':      'Entrar',
  'forgot-password': 'Recuperar Senha',
  'reset-password':  'Nova Senha',
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (navigating) {
      <div class="nav-progress-bar"></div>
    }
    <router-outlet />
  `,
  styles: [`
    .nav-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #559cee, #2563eb, #93c5fd);
      background-size: 200% 100%;
      animation: progress-slide 1s linear infinite;
      z-index: 9999;
    }
    @keyframes progress-slide {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class App implements OnInit {
  private router = inject(Router);
  private title  = inject(Title);

  navigating = false;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navigating = false;
        const segment = event.url.split('/')[1]?.split('?')[0] ?? '';
        const pageName = PAGE_TITLES[segment] ?? 'CESPGA';
        this.title.setTitle(`${pageName} — CESPGA`);
      }
    });
  }
}
