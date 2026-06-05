import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Situacao {
  id: number;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class SituacaoService {
  private url = `${environment.apiUrl}/situacao`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Situacao[]> {
    return this.http.get<Situacao[]>(this.url);
  }
}
