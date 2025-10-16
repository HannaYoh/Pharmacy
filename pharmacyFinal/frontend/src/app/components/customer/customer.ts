import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class Customer {
  constructor(private authService: AuthService, private router: Router) {}
  searchTerm = '';
  pharmacies = ['MyPharma', 'CityMed', 'HealthPlus'];
  prescriptions = '';

  search() {
    alert(`Searching for: ${this.searchTerm}`);
  }

  findMedicines() {
    alert(`Finding medicines for: ${this.prescriptions}`);
  }

  logout() {
    this.authService.logout();
  }
}
