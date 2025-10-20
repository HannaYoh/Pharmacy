// src/app/customer/customer.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  PharmacyService,
  PharmacySearchResult,
  MedicineSearchResult,
} from '../../services/pharmacy.service'; // <-- Import new interface

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [PharmacyService],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class Customer {
  pharmacySearchTerm = '';
  medicineSearchTerm = ''; // Use a clearer name

  pharmacyResults: PharmacySearchResult[] = [];
  medicineResults: MedicineSearchResult[] = []; // <-- Use the new result array

  constructor(
    private authService: AuthService,
    private router: Router,
    private pharmacyService: PharmacyService
  ) {}

  // 1. Search Pharmacies by Name (Logic remains the same)
  searchPharmaciesByName(): void {
    if (this.pharmacySearchTerm.trim() === '') {
      alert('Please enter a pharmacy name.');
      this.pharmacyResults = [];
      return;
    }

    this.pharmacyService.searchPharmacies(this.pharmacySearchTerm).subscribe({
      next: (data) => {
        this.pharmacyResults = data;
        if (data.length === 0) alert('No pharmacies found matching your search.');
      },
      error: (err) => {
        console.error('Pharmacy search failed:', err);
        alert('Error during pharmacy search.');
      },
    });
  }

  // 2. Search Medicines by Name (MODIFIED)
  searchMedicinesByName(): void {
    if (this.medicineSearchTerm.trim() === '') {
      alert('Please enter a medicine name.');
      this.medicineResults = [];
      return;
    }

    // Call the new service method
    this.pharmacyService.searchMedicinesByName(this.medicineSearchTerm).subscribe({
      next: (data) => {
        this.medicineResults = data;
        if (data.length === 0) alert('No medicines found matching your search.');
      },
      error: (err) => {
        console.error('Medicine search failed:', err);
        alert('Error during medicine search.');
      },
    });
  }

  // Helper method to link the button in HTML
  findMedicines() {
    this.searchMedicinesByName();
  }

  logout() {
    this.authService.logout();
  }
}
