import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/shell/shell').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'mediuns',
        loadComponent: () => import('./pages/mediuns/mediuns').then(m => m.MediunsComponent)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./pages/agenda/agenda').then(m => m.AgendaComponent)
      },
      {
        path: 'agenda/:id/album',
        loadComponent: () => import('./pages/album/album').then(m => m.AlbumComponent)
      },
      {
        path: 'cargos',
        loadComponent: () => import('./pages/cargos/cargos').then(m => m.CargosComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

