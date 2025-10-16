import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MedicineService, Medicine } from '../../services/medicine.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css'],
})
export class InventoryComponent implements OnInit {
  medicines: Medicine[] = [];
  newMedicine: Medicine = {
    name: '',
    genericname: '',
    manufacturer: '',
    description: '',
  };

  // EDIT STATE
  editIndex: number | null = null;
  editMedicine: Medicine = {
    name: '',
    genericname: '',
    manufacturer: '',
    description: '',
  };

  constructor(private medicineService: MedicineService) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.medicineService.getAll().subscribe({
      next: (res) => (this.medicines = res),
      error: (err) => console.error('Failed to fetch medicines', err),
    });
  }

  addMedicine() {
    this.medicineService.add(this.newMedicine).subscribe({
      next: (res) => {
        this.medicines.push(res);
        this.newMedicine = { name: '', genericname: '', manufacturer: '', description: '' };
      },
      error: (err) => console.error('Failed to add medicine', err),
    });
  }

  // ✅ FIXED: Call this from HTML
  startEdit(index: number) {
    this.editIndex = index;
    this.editMedicine = { ...this.medicines[index] };
  }

  updateMedicine() {
    if (this.editIndex === null) return;

    const medicineId = this.medicines[this.editIndex].id!;
    this.medicineService.update(medicineId, this.editMedicine).subscribe({
      next: (res) => {
        this.medicines[this.editIndex!] = res;
        this.cancelEdit();
      },
      error: (err) => console.error('Failed to update medicine', err),
    });
  }

  deleteMedicine(id: number) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    this.medicineService.delete(id).subscribe({
      next: () => {
        this.medicines = this.medicines.filter((m) => m.id !== id);
      },
      error: (err) => console.error('Failed to delete medicine', err),
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.editMedicine = { name: '', genericname: '', manufacturer: '', description: '' };
  }
}
