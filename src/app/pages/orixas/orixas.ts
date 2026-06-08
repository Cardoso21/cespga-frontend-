import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OrixaService } from '../../core/services/orixa.service';
import { AuthService } from '../../core/services/auth.service';
import { Orixa } from '../../core/models/orixa.model';

@Component({
  selector: 'app-orixas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    ToastModule,
    MessageModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  templateUrl: './orixas.html',
  styleUrl: './orixas.scss',
})
export class OrixasComponent implements OnInit {
  private service = inject(OrixaService);
  private auth = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  loggedIn$ = this.auth.loggedIn$;

  orixas: Orixa[] = [];
  loading = false;

  showModal = false;
  editingId: number | null = null;
  form: Orixa = { nome: '', historia: '', imagemUrl: '' };
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.findAll().subscribe({
      next: o => {
        this.orixas = o;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.orixas = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openCreate() {
    this.form = { nome: '', historia: '', imagemUrl: '' };
    this.editingId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(orixa: Orixa) {
    this.form = { ...orixa };
    this.editingId = orixa.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    if (!this.form.nome || !this.form.historia) return;

    const obs = this.editingId
      ? this.service.update({ ...this.form, id: this.editingId })
      : this.service.create(this.form);

    obs.subscribe({
      next: () => {
        this.showModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.editingId ? 'Orixá atualizado.' : 'Orixá criado.'
        });
        this.load();
      },
      error: () => {
        this.error = 'Erro ao salvar o orixá.';
        this.cdr.markForCheck();
      }
    });
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este orixá?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Orixá excluído.' });
            this.load();
          }
        });
      }
    });
  }
}
