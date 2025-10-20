// src/app/owner/pharmacy-registration/pharmacy-registration.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PharmacyService, PharmacyRegistrationModel } from '../../services/pharmacy.service';

@Component({
  selector: 'app-pharmacy-registration',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule],
  providers: [PharmacyService],
  templateUrl: './pharmacy-registration.html',
  styleUrls: ['./pharmacy-registration.css'],
})
export class PharmacyRegistrationComponent {
  // Model reflects the form inputs
  model: PharmacyRegistrationModel = {
    name: '',
    licenseNumber: '',
    address: '',
    phone: '',
    latitude: null,
    longitude: null,
  };

  submitted = false;

  constructor(private pharmacyService: PharmacyService) {}

  submit(): void {
    this.submitted = true;

    // Create a payload, ensuring Lat/Lon are properly typed as numbers (or null)
    const payload: PharmacyRegistrationModel = {
      ...this.model,
      latitude: this.model.latitude ? parseFloat(this.model.latitude.toString()) : null,
      longitude: this.model.longitude ? parseFloat(this.model.longitude.toString()) : null,
    };

    this.pharmacyService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration Success:', response);
        alert('Pharmacy registered successfully! Awaiting Admin approval.');
      },
      error: (error) => {
        console.error('Registration Failed:', error);
        alert('Registration failed. Please check your data and network connection.');
        this.submitted = false;
      },
    });
  }
}
