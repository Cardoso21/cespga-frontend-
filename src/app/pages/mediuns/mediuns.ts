import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediumService } from '../../core/services/medium.service';
import { CargoService } from '../../core/services/cargo.service';
import { Medium } from '../../core/models/medium.model';
import { Cargo } from '../../core/models/cargo.model';

@Component({
  selector: 'app-mediuns',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './mediuns.html',
  styleUrl: './mediuns.scss',
})
export class MediunsComponent implements OnInit {
  mediuns: Medium[] = [];
  cargos: Cargo[] = [];
  page = 0;
  totalPages = 0;
  totalElements = 0;
  searchNome = '';
  loading = false;
  showModal = false;
  showDeleteModal = false;
  editingId: number | null = null;
  deleteTargetId: number | null = null;
  error = '';

  form: Medium = this.emptyForm();

  constructor(private service: MediumService, private cargoService: CargoService) {}

  ngOnInit() {
    this.load();
    this.cargoService.findAll().subscribe({ next: c => this.cargos = c });
  }

  load() {
    this.loading = true;
    const obs = this.searchNome
      ? this.service.findByNome(this.searchNome, this.page)
      : this.service.findAll(this.page);

    obs.subscribe({
      next: r => {
        const key = Object.keys(r._embedded)[0];
        this.mediuns = r._embedded[key] ?? [];
        this.totalPages = r.page.totalPages;
        this.totalElements = r.page.totalElements;
        this.loading = false;
      },
      error: () => { this.mediuns = []; this.loading = false; }
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

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  goTo(p: number) {
    this.page = p;
    this.load();
  }

  openCreate() {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showModal = true;
    this.error = '';
  }

  openEdit(m: Medium) {
    this.form = { ...m, cargos: m.cargos };
    this.editingId = m.id ?? null;
    this.showModal = true;
    this.error = '';
  }

  save() {
    const obs = this.editingId
      ? this.service.update({ ...this.form, id: this.editingId })
      : this.service.create(this.form);

    obs.subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.error = 'Erro ao salvar. Verifique os dados.'; }
    });
  }

  confirmDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  doDelete() {
    if (this.deleteTargetId == null) return;
    this.service.delete(this.deleteTargetId).subscribe({
      next: () => { this.showDeleteModal = false; this.deleteTargetId = null; this.load(); },
      error: () => { this.showDeleteModal = false; }
    });
  }

  cargoSelected(id: string) {
    const cargo = this.cargos.find(c => c.id === +id);
    if (cargo?.id != null) this.form.cargos = { id: cargo.id, descricao: cargo.descricao };
  }

  private emptyForm(): Medium {
    return {
      nome: '', sobrenome: '', cpf: '', dataNascimento: '', email: '',
      telefone: '', endereco: '', sexo: '', nomeMae: '', nomePai: '', dataCadastro: ''
    };
  }
}

