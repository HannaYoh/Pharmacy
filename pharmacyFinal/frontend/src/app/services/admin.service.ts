import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interface matching the data returned by the backend 'pending' endpoint
export interface PendingPharmacy {
  id: number;
  name: string;
  licenseNumber: string;
  owner: string; // MOCKED owner name
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5035/api/Pharmacy';

  // Inject AuthService to get the token
  constructor(private http: HttpClient, private authService: AuthService) {}

  /*  private getAuthHeaders(): HttpHeaders {
    // 1. Retrieve the token (replace with your actual retrieval logic)
    const token = this.authService.getToken(); // Assuming getToken() exists and returns the JWT

    // 2. Create the headers object with the Authorization header
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add the token here
    });
  } */

  getPendingPharmacies(): Observable<PendingPharmacy[]> {
    // Pass the headers object to the request options
    /* return this.http.get<PendingPharmacy[]>(`${this.apiUrl}/pending`, {
      headers: this.getAuthHeaders(),}); */
    return this.http.get<PendingPharmacy[]>(`${this.apiUrl}/pending`);
  }

  /* updatePharmacyStatus(id: number, status: boolean): Observable<any> {
    // Pass the headers object to the request options
    return this.http.put(`${this.apiUrl}/${id}/status`, status, { headers: this.getAuthHeaders() });
  } */
  updatePharmacyStatus(id: number, status: boolean): Observable<any> {
    // TEMPORARILY UNAUTHORIZED: This will still fail with 401 later!
    return this.http.put(`${this.apiUrl}/${id}/status`, status);
  }
}
