import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Agenda, FotoEvento } from '../models/agenda.model';
import { PagedResponse } from '../models/medium.model';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private url = `${environment.apiUrl}/agenda`;
  private fotosUrl = `${environment.apiUrl}/fotos`;

  constructor(private http: HttpClient) {}

  findAll(page = 0, size = 12, direction = 'asc'): Observable<PagedResponse<Agenda>> {
    const params = new HttpParams().set('page', page).set('size', size).set('direction', direction);
    return this.http.get<PagedResponse<Agenda>>(this.url, { params });
  }

  findById(id: number): Observable<Agenda> {
    return this.http.get<Agenda>(`${this.url}/${id}`);
  }

  create(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(this.url, agenda);
  }

  update(agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(this.url, agenda);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  listarFotos(agendaId: number): Observable<FotoEvento[]> {
    return this.http.get<FotoEvento[]>(`${this.fotosUrl}/evento/${agendaId}`);
  }

  uploadFoto(agendaId: number, arquivo: File, descricao?: string): Observable<FotoEvento> {
    const form = new FormData();
    form.append('arquivo', arquivo);
    if (descricao) form.append('descricao', descricao);
    return this.http.post<FotoEvento>(`${this.fotosUrl}/evento/${agendaId}`, form);
  }

  deletarFoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.fotosUrl}/${id}`);
  }
}
