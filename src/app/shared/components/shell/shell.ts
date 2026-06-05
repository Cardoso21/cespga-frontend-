import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, AsyncPipe, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  private auth    = inject(AuthService);
  private router  = inject(Router);
  private toast   = inject(MessageService);
  private confirm = inject(ConfirmationService);

  loggedIn$ = this.auth.loggedIn$;

  get username(): string {
    return this.auth.getToken()?.username ?? '';
  }

  get initials(): string {
    const name = this.username;
    if (!name) return '?';
    const parts = name.split(/[.\-_\s]/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }

  ngOnInit() {
    const pending = sessionStorage.getItem('welcome');
    if (pending) {
      sessionStorage.removeItem('welcome');
      setTimeout(() => {
        this.toast.add({
          severity: 'success',
          summary: `Bem-vindo, ${pending}!`,
          detail: 'Você está conectado ao sistema CESPGA.',
          life: 4000
        });
      }, 500);
    }
  }

  logout() {
    this.confirm.confirm({
      message: 'Deseja sair do sistema?',
      header: 'Confirmar saída',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Sair',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.auth.logout()
    });
  }

  login() { this.router.navigate(['/login']); }

  toggleMobileSidebar() {
    this.sidebar.toggleMobile();
  }
}
