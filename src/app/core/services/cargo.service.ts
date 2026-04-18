import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cargo } from '../models/cargo.model';

@Injectable({ providedIn: 'root' })
export class CargoService {
  private url = `${environment.apiUrl}/cargos`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.url);
  }

  findById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.url}/${id}`);
  }

  create(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.url, cargo);
  }
}