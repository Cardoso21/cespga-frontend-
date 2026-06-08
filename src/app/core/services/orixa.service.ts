import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Orixa } from '../models/orixa.model';

@Injectable({ providedIn: 'root' })
export class OrixaService {
  private url = `${environment.apiUrl}/orixas`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Orixa[]> {
    return this.http.get<Orixa[]>(this.url);
  }

  findById(id: number): Observable<Orixa> {
    return this.http.get<Orixa>(`${this.url}/${id}`);
  }

  create(orixa: Orixa): Observable<Orixa> {
    return this.http.post<Orixa>(this.url, orixa);
  }

  update(orixa: Orixa): Observable<Orixa> {
    return this.http.put<Orixa>(this.url, orixa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
