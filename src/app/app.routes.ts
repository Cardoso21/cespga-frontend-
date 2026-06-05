import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
    loadComponent: () => import('./shared/components/shell/shell').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'mediuns',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/mediuns/mediuns').then(m => m.MediunsComponent)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./pages/agenda/agenda').then(m => m.AgendaComponent)
      },
      {
        path: 'fotos',
        loadComponent: () => import('./pages/fotos/fotos').then(m => m.FotosComponent)
      },
      {
        path: 'agenda/:id/album',
        loadComponent: () => import('./pages/album/album').then(m => m.AlbumComponent)
      },
      {
        path: 'cargos',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/cargos/cargos').then(m => m.CargosComponent)
      },
      {
        path: 'usuarios',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent)
      }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent) }
];

