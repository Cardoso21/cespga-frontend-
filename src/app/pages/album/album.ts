import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../core/services/agenda.service';
import { FotoEvento } from '../../core/models/agenda.model';

@Component({
  selector: 'app-album',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class AlbumComponent implements OnInit {
  agendaId!: number;
  fotos: FotoEvento[] = [];
  loading = false;
  uploading = false;
  selectedFile: File | null = null;
  descricao = '';
  lightboxUrl: string | null = null;
  deleteTargetId: number | null = null;
  showDeleteModal = false;

  constructor(private route: ActivatedRoute, private service: AgendaService) {}

  ngOnInit() {
    this.agendaId = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load() {
    this.loading = true;
    this.service.listarFotos(this.agendaId).subscribe({
      next: f => { this.fotos = f; this.loading = false; },
      error: () => { this.fotos = []; this.loading = false; }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  upload() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.service.uploadFoto(this.agendaId, this.selectedFile, this.descricao).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFile = null;
        this.descricao = '';
        this.load();
      },
      error: () => { this.uploading = false; }
    });
  }

  openLightbox(url: string) {
    this.lightboxUrl = url;
  }

  confirmDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  doDelete() {
    if (this.deleteTargetId == null) return;
    this.service.deletarFoto(this.deleteTargetId).subscribe({
      next: () => { this.showDeleteModal = false; this.deleteTargetId = null; this.load(); }
    });
  }
}

