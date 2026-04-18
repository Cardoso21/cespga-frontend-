import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CargoService } from '../../core/services/cargo.service';
import { Cargo } from '../../core/models/cargo.model';

@Component({
  selector: 'app-cargos',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './cargos.html',
  styleUrl: './cargos.scss',
})
export class CargosComponent implements OnInit {
  cargos: Cargo[] = [];
  loading = false;
  showModal = false;
  form: Cargo = { descricao: '' };
  error = '';

  constructor(private service: CargoService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.findAll().subscribe({
      next: c => { this.cargos = c; this.loading = false; },
      error: () => { this.cargos = []; this.loading = false; }
    });
  }

  openCreate() {
    this.form = { descricao: '' };
    this.showModal = true;
    this.error = '';
  }

  save() {
    if (!this.form.descricao) return;
    this.service.create(this.form).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.error = 'Erro ao salvar o cargo.'; }
    });
  }
}

