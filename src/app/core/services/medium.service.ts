import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Medium, PagedResponse } from '../models/medium.model';

@Injectable({ providedIn: 'root' })
export class MediumService {
  private url = `${environment.apiUrl}/medium`;

  constructor(private http: HttpClient) {}

  findAll(page = 0, size = 12, direction = 'asc'): Observable<PagedResponse<Medium>> {
    const params = new HttpParams().set('page', page).set('size', size).set('direction', direction);
    return this.http.get<PagedResponse<Medium>>(this.url, { params });
  }

  findByNome(nome: string, page = 0, size = 12): Observable<PagedResponse<Medium>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Medium>>(`${this.url}/findByNome/${nome}`, { params });
  }

  findById(id: number): Observable<Medium> {
    return this.http.get<Medium>(`${this.url}/${id}`);
  }

  create(medium: Medium): Observable<Medium> {
    return this.http.post<Medium>(this.url, medium);
  }

  update(medium: Medium): Observable<Medium> {
    return this.http.put<Medium>(this.url, medium);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}