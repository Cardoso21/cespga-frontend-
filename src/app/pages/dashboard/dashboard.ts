import { Component, OnInit } from '@angular/core';
import { NgIf, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediumService } from '../../core/services/medium.service';
import { AgendaService } from '../../core/services/agenda.service';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, SlicePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  totalMediuns = 0;
  totalEventos = 0;
  proximoEvento: any = null;

  constructor(
    private mediumService: MediumService,
    private agendaService: AgendaService
  ) {}

  ngOnInit() {
    this.mediumService.findAll(0, 1).subscribe({
      next: r => this.totalMediuns = r.page.totalElements
    });
    this.agendaService.findAll(0, 1).subscribe({
      next: r => {
        this.totalEventos = r.page.totalElements;
        const key = Object.keys(r._embedded)[0];
        this.proximoEvento = r._embedded[key]?.[0] ?? null;
      }
    });
  }
}

