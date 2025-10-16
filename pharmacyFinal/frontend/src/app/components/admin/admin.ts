import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  constructor(private authService: AuthService, private router: Router) {}
  pendingPharmacies = [
    { name: 'CityMed', owner: 'John Doe' },
    { name: 'QuickPharma', owner: 'Jane Lee' },
  ];

  approve(pharmacy: any) {
    alert(`Approved ${pharmacy.name}`);
  }

  reject(pharmacy: any) {
    alert(`Rejected ${pharmacy.name}`);
  }

  viewMedicines() {
    alert('View all medicine data logic here');
  }

  //new
  logout() {
    this.authService.logout();
  }
}
