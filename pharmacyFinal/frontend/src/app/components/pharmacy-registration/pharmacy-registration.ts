import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pharmacy-registration',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pharmacy-registration.html',
  styleUrls: ['./pharmacy-registration.css'],
})
export class PharmacyRegistrationComponent {
  model = {
    name: '',
    licenseNumber: '',
    address: '',
    phone: '',
    hours: '',
    latitude: '',
    longitude: '',
  };

  submitted = false;

  submit(): void {
    this.submitted = true;
    // TODO: call backend API when available
    console.log('Pharmacy registration submitted', this.model);
    alert('Pharmacy registration submitted (mock).');
  }
}
