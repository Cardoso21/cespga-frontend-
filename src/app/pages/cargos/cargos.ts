import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CargoService } from '../../core/services/cargo.service';
import { Cargo } from '../../core/models/cargo.model';

@Component({
  selector: 'app-cargos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardModule, TableModule, DialogModule, ButtonModule, InputTextModule, ToastModule, MessageModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './cargos.html',
  styleUrl: './cargos.scss',
})
export class CargosComponent implements OnInit {
  private service = inject(CargoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  cargos: Cargo[] = [];
  loading = false;
  showModal = false;
  editingId: number | null = null;
  form: Cargo = { descricao: '' };
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.findAll().subscribe({
      next: c => {
        this.cargos = c;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargos = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openCreate() {
    this.form = { descricao: '' };
    this.editingId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(cargo: Cargo) {
    this.form = { ...cargo };
    this.editingId = cargo.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    if (!this.form.descricao) return;

    const obs = this.editingId
      ? this.service.update({ ...this.form, id: this.editingId })
      : this.service.create(this.form);

    obs.subscribe({
      next: () => {
        this.showModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.editingId ? 'Cargo atualizado.' : 'Cargo criado.'
        });
        this.load();
      },
      error: () => {
        this.error = 'Erro ao salvar o cargo.';
        this.cdr.markForCheck();
      }
    });
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este cargo?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cargo excluído.' });
            this.load();
          }
        });
      }
    });
  }
}
