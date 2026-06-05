import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SlicePipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MediumService } from '../../core/services/medium.service';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe, AsyncPipe, RouterLink, CardModule, TagModule, ButtonModule, SkeletonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private mediumService = inject(MediumService);
  private agendaService = inject(AgendaService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loggedIn$ = this.auth.loggedIn$;

  totalMediuns = 0;
  totalEventos = 0;
  proximoEvento: any = null;
  loadingMediuns = true;
  loadingEventos = true;

  ngOnInit() {
    this.mediumService.findAll(0, 1).subscribe({
      next: r => {
        this.totalMediuns = r.page?.totalElements ?? 0;
        this.loadingMediuns = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loadingMediuns = false; this.cdr.markForCheck(); }
    });

    this.agendaService.findAll(0, 1).subscribe({
      next: r => {
        this.totalEventos = r.page?.totalElements ?? 0;
        const key = r._embedded ? Object.keys(r._embedded)[0] : null;
        this.proximoEvento = key ? r._embedded[key]?.[0] ?? null : null;
        this.loadingEventos = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loadingEventos = false; this.cdr.markForCheck(); }
    });
  }
}
