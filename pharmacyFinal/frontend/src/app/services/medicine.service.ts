import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  id?: number;
  name: string;
  genericname?: string;
  manufacturer?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private baseUrl = 'http://localhost:5035/api/medicine';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.baseUrl);
  }

  add(med: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.baseUrl, med);
  }

  update(id: number, med: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}`, med);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
