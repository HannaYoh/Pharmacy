import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css'],
})
export class InventoryComponent {
  medicines: any[] = [];
  newMedicine = {
    name: '',
    genericName: '',
    manufacturer: '',
    description: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.http.get<any[]>('http://localhost:5035/api/medicine').subscribe({
      next: (res) => (this.medicines = res),
      error: (err) => console.error('Failed to fetch medicines', err),
    });
  }

  addMedicine() {
    this.http.post('http://localhost:5035/api/medicine', this.newMedicine).subscribe({
      next: (res) => {
        this.medicines.push(res);
        this.newMedicine = { name: '', genericName: '', manufacturer: '', description: '' };
      },
      error: (err) => console.error('Failed to add medicine', err),
    });
  }
}
