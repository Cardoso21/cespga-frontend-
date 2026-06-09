import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { MediumService } from '../../core/services/medium.service';
import { User } from '../../core/models/user.model';
import { Medium } from '../../core/models/medium.model';

@Component({
  selector: 'app-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, CardModule, ButtonModule, TagModule,
    ToastModule, ConfirmDialogModule, TableModule, DialogModule,
    InputTextModule, PasswordModule, MessageModule, SelectModule, PaginatorModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent implements OnInit {
  private service = inject(UserService);
  private mediumService = inject(MediumService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  mediuns: Medium[] = [];
  mediunOptions: { label: string; value: Medium }[] = [];
  selectedMedium: Medium | null = null;

  page = 0;
  totalElements = 0;
  readonly pageSize = 10;
  loading = false;
  showModal = false;
  saving = false;
  error = '';

  form = { username: '', fullName: '', password: '' };

  ngOnInit() {
    this.load();
    this.loadMediuns();
  }

  load() {
    this.loading = true;
    this.service.findAll(this.page, this.pageSize).subscribe({
      next: res => {
        this.users = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.load();
  }

  loadMediuns() {
    this.mediumService.findAll(0, 999).subscribe({
      next: res => {
        const key = res._embedded ? Object.keys(res._embedded)[0] : null;
        this.mediuns = key ? res._embedded[key] : [];
        this.mediunOptions = this.mediuns.map(m => ({
          label: `${m.nome} ${m.sobrenome}`,
          value: m
        }));
        this.cdr.markForCheck();
      }
    });
  }

  onMediumSelect(medium: Medium) {
    this.form.fullName = `${medium.nome} ${medium.sobrenome}`;
    this.cdr.markForCheck();
  }

  isAdmin(user: User): boolean {
    return user.permissions.some(p => p.authority === 'ADMIN');
  }

  openCreate() {
    this.form = { username: '', fullName: '', password: '' };
    this.selectedMedium = null;
    this.error = '';
    this.showModal = true;
  }

  save() {
    if (!this.form.username || !this.form.fullName || !this.form.password) {
      this.error = 'Preencha todos os campos.';
      this.cdr.markForCheck();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.username)) {
      this.error = 'O e-mail informado não é válido.';
      this.cdr.markForCheck();
      return;
    }
    this.saving = true;
    this.error = '';
    this.service.create(this.form).subscribe({
      next: () => {
        this.showModal = false;
        this.saving = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado.' });
        this.load();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.status === 409 ? 'Usuário já existe.' : 'Erro ao criar usuário.';
        this.cdr.markForCheck();
      }
    });
  }

  toggleEnabled(user: User) {
    const action = user.enabled ? 'inativar' : 'reativar';
    this.confirmationService.confirm({
      message: `Deseja ${action} o usuário <strong>${user.fullName}</strong>?`,
      header: 'Confirmar',
      icon: 'pi pi-ban',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const req = user.enabled ? this.service.disable(user.id) : this.service.enable(user.id);
        req.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: user.enabled ? 'Usuário inativado.' : 'Usuário reativado.'
            });
            this.load();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Operação falhou.' });
          }
        });
      }
    });
  }

  toggleAdmin(user: User) {
    const action = this.isAdmin(user) ? 'remover admin de' : 'tornar admin';
    this.confirmationService.confirm({
      message: `Deseja ${action} <strong>${user.fullName}</strong>?`,
      header: 'Confirmar',
      icon: 'pi pi-shield',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const wasAdmin = this.isAdmin(user);
        const req = wasAdmin ? this.service.revokeAdmin(user.id) : this.service.grantAdmin(user.id);
        req.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: wasAdmin ? 'Admin removido.' : 'Admin concedido.'
            });
            this.load();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Operação falhou.' });
          }
        });
      }
    });
  }
}
