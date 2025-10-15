import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
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
}
