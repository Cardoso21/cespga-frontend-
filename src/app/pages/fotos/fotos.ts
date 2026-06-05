import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';
import { FotoEvento } from '../../core/models/agenda.model';

@Component({
  selector: 'app-fotos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, FormsModule, CardModule, ButtonModule, InputTextModule, ProgressSpinnerModule, ToastModule, ConfirmDialogModule],
  templateUrl: './fotos.html',
  styleUrl: './fotos.scss',
})
export class FotosComponent implements OnInit {
  private service = inject(AgendaService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  loggedIn$ = this.auth.loggedIn$;

  fotos: FotoEvento[] = [];
  loading = false;
  uploading = false;
  selectedFile: File | null = null;
  descricao = '';
  lightboxUrl: string | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.listarTodasFotos().subscribe({
      next: f => {
        this.fotos = f;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.fotos = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  upload() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.service.uploadFotoGeral(this.selectedFile, this.descricao).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFile = null;
        this.descricao = '';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Foto enviada com sucesso.' });
        this.load();
      },
      error: () => { this.uploading = false; }
    });
  }

  openLightbox(url: string) {
    this.lightboxUrl = url;
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta foto?',
      header: 'Excluir foto',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.deletarFoto(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Foto excluída.' });
            this.load();
          }
        });
      }
    });
  }
}
