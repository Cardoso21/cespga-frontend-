import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { MediumService } from '../../core/services/medium.service';
import { CargoService } from '../../core/services/cargo.service';
import { Medium } from '../../core/models/medium.model';
import { Cargo } from '../../core/models/cargo.model';

@Component({
  selector: 'app-mediuns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TableModule, DialogModule, ButtonModule, InputTextModule,
    SelectModule, TagModule, ToastModule, ConfirmDialogModule, MessageModule,
    PaginatorModule, CardModule, InputMaskModule, TooltipModule
  ],
  templateUrl: './mediuns.html',
  styleUrl: './mediuns.scss',
})
export class MediunsComponent implements OnInit {
  private service = inject(MediumService);
  private cargoService = inject(CargoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  mediuns: Medium[] = [];
  cargos: Cargo[] = [];
  page = 0;
  totalElements = 0;
  readonly pageSize = 10;
  searchNome = '';
  filterCargoId: number | null = null;
  loading = false;
  showModal = false;
  editingId: number | null = null;
  error = '';

  form: Medium = this.emptyForm();
  cargoOptions: { label: string; value: number }[] = [];
  selectedCargoId: number | null = null;

  ngOnInit() {
    this.load();
    this.cargoService.findAll().subscribe({
      next: c => {
        this.cargos = c;
        this.cargoOptions = c.map(cargo => ({ label: cargo.descricao, value: cargo.id! }));
        this.cdr.markForCheck();
      }
    });
  }

  load() {
    this.loading = true;
    let obs;
    if (this.searchNome.trim()) {
      obs = this.service.findByNome(this.searchNome.trim(), this.page);
    } else if (this.filterCargoId) {
      obs = this.service.findByCargo(this.filterCargoId, this.page);
    } else {
      obs = this.service.findAll(this.page);
    }

    obs.subscribe({
      next: r => {
        const key = r._embedded ? Object.keys(r._embedded)[0] : null;
        this.mediuns = key ? r._embedded[key] ?? [] : [];
        this.totalElements = r.page?.totalElements ?? 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mediuns = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  search() { this.page = 0; this.filterCargoId = null; this.load(); }
  clearSearch() { this.searchNome = ''; this.filterCargoId = null; this.page = 0; this.load(); }
  onCargoFilter(cargoId: number | null) { this.searchNome = ''; this.filterCargoId = cargoId; this.page = 0; this.load(); }

  onPageChange(event: any) {
    this.page = event.first / event.rows;
    this.load();
  }

  openCreate() {
    this.form = this.emptyForm();
    this.editingId = null;
    this.selectedCargoId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(m: Medium) {
    this.form = {
      ...m,
      dataNascimento: this.toDateInput(m.dataNascimento),
      dataCadastro: this.toDateInput(m.dataCadastro),
      cargos: m.cargos
    };
    this.editingId = m.id ?? null;
    this.selectedCargoId = m.cargos?.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    if (this.selectedCargoId != null) {
      const cargo = this.cargos.find(c => c.id === this.selectedCargoId);
      if (cargo?.id != null) this.form.cargos = { id: cargo.id, descricao: cargo.descricao };
    } else {
      this.form.cargos = undefined;
    }

    const toTs = (d: string): number | null => {
      if (!d) return null;
      const ts = new Date(d).getTime();
      return isNaN(ts) ? null : ts;
    };

    const payload: any = {
      ...this.form,
      dataNascimento: toTs(this.form.dataNascimento),
      dataCadastro: toTs(this.form.dataCadastro)
    };

    const obs = this.editingId
      ? this.service.update({ ...payload, id: this.editingId })
      : this.service.create(payload);

    obs.subscribe({
      next: () => {
        this.showModal = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Médium salvo com sucesso.' });
        this.load();
      },
      error: () => {
        this.error = 'Erro ao salvar. Verifique os dados.';
        this.cdr.markForCheck();
      }
    });
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este médium? Esta ação não pode ser desfeita.',
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Médium excluído.' });
            this.load();
          }
        });
      }
    });
  }

  private toDateInput(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  private emptyForm(): Medium {
    return {
      nome: '', sobrenome: '', cpf: '', dataNascimento: '', email: '',
      telefone: '', endereco: '', sexo: '', nomeMae: '', nomePai: '', dataCadastro: ''
    };
  }
}
