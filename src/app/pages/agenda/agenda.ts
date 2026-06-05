import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';
import { SituacaoService, Situacao } from '../../core/services/situacao.service';
import { Agenda } from '../../core/models/agenda.model';

@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe, SlicePipe, FormsModule,
    CardModule, DialogModule, ButtonModule, InputTextModule, TextareaModule,
    TagModule, ToastModule, ConfirmDialogModule, MessageModule,
    PaginatorModule, ProgressSpinnerModule, SelectModule
  ],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class AgendaComponent implements OnInit {
  private service = inject(AgendaService);
  private auth = inject(AuthService);
  private situacaoService = inject(SituacaoService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  loggedIn$ = this.auth.loggedIn$;

  eventos: Agenda[] = [];
  situacoes: Situacao[] = [];
  page = 0;
  totalElements = 0;
  readonly pageSize = 9;
  loading = false;
  showModal = false;
  editingId: number | null = null;
  error = '';
  searchNome = '';

  form: Agenda = this.emptyForm();

  ngOnInit() {
    this.load();
    this.situacaoService.findAll().subscribe({
      next: s => { this.situacoes = s; this.cdr.markForCheck(); }
    });
  }

  load() {
    this.loading = true;
    const obs = this.searchNome.trim()
      ? this.service.findByNome(this.searchNome.trim(), this.page, this.pageSize)
      : this.service.findAll(this.page, this.pageSize);

    obs.subscribe({
      next: r => {
        const key = r._embedded ? Object.keys(r._embedded)[0] : null;
        this.eventos = key ? r._embedded[key] ?? [] : [];
        this.totalElements = r.page?.totalElements ?? 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.eventos = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  search() {
    this.page = 0;
    this.load();
  }

  clearSearch() {
    this.searchNome = '';
    this.page = 0;
    this.load();
  }

  goToAlbum(id: number) {
    this.router.navigate(['/agenda', id, 'album']);
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.load();
  }

  openCreate() {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(e: Agenda) {
    this.form = {
      ...e,
      dataEvento: e.dataEvento ? String(e.dataEvento).substring(0, 10) : ''
    };
    this.editingId = e.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    const obs = this.editingId
      ? this.service.update({ ...this.form, id: this.editingId })
      : this.service.create(this.form);

    obs.subscribe({
      next: () => {
        this.showModal = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento salvo com sucesso.' });
        this.load();
      },
      error: () => {
        this.error = 'Erro ao salvar o evento.';
        this.cdr.markForCheck();
      }
    });
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este evento?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento excluído.' });
            this.load();
          }
        });
      }
    });
  }

  monthName(date: string): string {
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const m = parseInt(date?.substring(5, 7) ?? '1', 10) - 1;
    return months[m] ?? '';
  }

  friendlyDate(date: string): string {
    if (!date) return '';
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(date + 'T00:00:00');
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    if (diff === -1) return 'Ontem';
    if (diff > 1 && diff <= 7) return `Em ${diff} dias`;
    if (diff < -1 && diff >= -7) return `Há ${Math.abs(diff)} dias`;
    return date.substring(0, 10);
  }

  situacaoClass(descricao?: string): string {
    switch (descricao) {
      case 'Aguardando': return 'evento-aguardando';
      case 'Adiado':     return 'evento-adiado';
      case 'Finalizado': return 'evento-finalizado';
      case 'Cancelado':  return 'evento-cancelado';
      default:           return '';
    }
  }

  situacaoSeverity(descricao?: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' {
    switch (descricao) {
      case 'Aguardando': return 'info';
      case 'Adiado':     return 'warn';
      case 'Finalizado': return 'success';
      case 'Cancelado':  return 'danger';
      default:           return 'secondary';
    }
  }

  private emptyForm(): Agenda {
    return { nome: '', dataEvento: '', descricao: '' };
  }
}
