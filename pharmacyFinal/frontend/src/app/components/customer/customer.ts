import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class Customer {
  searchTerm = '';
  pharmacies = ['MyPharma', 'CityMed', 'HealthPlus'];
  prescriptions = '';

  search() {
    alert(`Searching for: ${this.searchTerm}`);
  }

  findMedicines() {
    alert(`Finding medicines for: ${this.prescriptions}`);
  }
}
