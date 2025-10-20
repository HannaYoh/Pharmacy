// src/app/services/pharmacy.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Data contract matching the fields we are sending to the API
export interface PharmacyRegistrationModel {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  // NOTE: If you were to send IsApproved or OwnerUserId, the backend would accept them!
}

export interface PharmacySearchResult {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
}

// NEW Interface for Medicine Search Results
export interface MedicineSearchResult {
  id: number;
  name: string;
  manufacturer?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PharmacyService {
  // *** CRITICAL: Adjust this URL and Port to match your running .NET API ***
  private apiUrl = 'http://localhost:5035/api/Pharmacy';

  constructor(private http: HttpClient) {}

  register(model: PharmacyRegistrationModel): Observable<any> {
    // Send the model data (which acts as the DTO)
    return this.http.post(this.apiUrl, model);
  }

  // Search pharmacies by name (No change to method name or signature)
  searchPharmacies(name: string): Observable<PharmacySearchResult[]> {
    return this.http.get<PharmacySearchResult[]>(`${this.apiUrl}/search?name=${name}`);
  }

  // MODIFIED: Search for medicines by name
  searchMedicinesByName(medicineName: string): Observable<MedicineSearchResult[]> {
    return this.http.get<MedicineSearchResult[]>(
      `${this.apiUrl}/search/medicine?medicineName=${medicineName}`
    );
  }
}
