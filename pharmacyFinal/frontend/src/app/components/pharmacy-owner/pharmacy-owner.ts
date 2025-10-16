import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './pharmacy-owner.html',
  styleUrls: ['./pharmacy-owner.css'],
})
export class PharmacyOwner {
  pharmacies = [{ name: 'MyPharma', location: 'Addis Ababa' }];
  medicines = [
    { name: 'Paracetamol', price: 20 },
    { name: 'Amoxicillin', price: 50 },
  ];

  addMedicine() {
    alert('Add medicine logic here');
  }

  editMedicine(med: any) {
    alert(`Edit ${med.name}`);
  }

  deleteMedicine(med: any) {
    this.medicines = this.medicines.filter((m) => m !== med);
  }
}
