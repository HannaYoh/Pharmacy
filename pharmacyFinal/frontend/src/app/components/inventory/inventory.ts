import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgIf, NgFor, RouterLink],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class InventoryComponent {
  items: Array<{ name: string; price: number; quantity: number }> = [];
  newItem = { name: '', price: 0, quantity: 0 };
  editIndex: number | null = null;
  editItem: { name: string; price: number; quantity: number } = { name: '', price: 0, quantity: 0 };

  add(): void {
    if (!this.newItem.name) return;
    this.items.push({
      name: this.newItem.name,
      price: this.newItem.price,
      quantity: this.newItem.quantity,
    });
    this.newItem = { name: '', price: 0, quantity: 0 };
  }
}
