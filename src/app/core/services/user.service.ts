import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface UserPage {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  findAll(page = 0, size = 10): Observable<UserPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<UserPage>(this.url, { params });
  }

  create(data: { username: string; fullName: string; password: string }): Observable<User> {
    return this.http.post<User>(this.url, data);
  }

  disable(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/disable`, {});
  }

  enable(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/enable`, {});
  }

  grantAdmin(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}/${id}/admin`, {});
  }

  revokeAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}/admin`);
  }
}
