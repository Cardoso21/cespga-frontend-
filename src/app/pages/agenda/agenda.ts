import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgendaService } from '../../core/services/agenda.service';
import { Agenda } from '../../core/models/agenda.model';

@Component({
  selector: 'app-agenda',
  imports: [NgIf, NgFor, SlicePipe, FormsModule, RouterLink],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class AgendaComponent implements OnInit {
  eventos: Agenda[] = [];
  page = 0;
  totalPages = 0;
  loading = false;
  showModal = false;
  showDeleteModal = false;
  editingId: number | null = null;
  deleteTargetId: number | null = null;
  error = '';

  form: Agenda = this.emptyForm();

  constructor(private service: AgendaService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.findAll(this.page).subscribe({
      next: r => {
        const key = Object.keys(r._embedded)[0];
        this.eventos = r._embedded[key] ?? [];
        this.totalPages = r.page.totalPages;
        this.loading = false;
      },
      error: () => { this.eventos = []; this.loading = false; }
    });
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  goTo(p: number) { this.page = p; this.load(); }

  openCreate() {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(e: Agenda) {
    this.form = { ...e };
    this.editingId = e.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    const obs = this.editingId
      ? this.service.update({ ...this.form, id: this.editingId })
      : this.service.create(this.form);

    obs.subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.error = 'Erro ao salvar o evento.'; }
    });
  }

  confirmDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  doDelete() {
    if (this.deleteTargetId == null) return;
    this.service.delete(this.deleteTargetId).subscribe({
      next: () => { this.showDeleteModal = false; this.deleteTargetId = null; this.load(); }
    });
  }

  monthName(date: string): string {
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const m = parseInt(date?.substring(5, 7) ?? '1', 10) - 1;
    return months[m] ?? '';
  }

  private emptyForm(): Agenda {
    return { nome: '', dataEvento: '', descricao: '' };
  }
}


