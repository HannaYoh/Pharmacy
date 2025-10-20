import { Component, OnInit } from '@angular/core'; // <-- Import OnInit
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Required for HttpClient
import { AdminService, PendingPharmacy } from '../../services/admin.service'; // <-- Import AdminService and Model
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Add HttpClientModule to imports
  providers: [AdminService], // Provide the service
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  // <-- Implement OnInit

  // Initialize with an empty array of the correct type
  pendingPharmacies: PendingPharmacy[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService // <-- Inject AdminService
  ) {}

  ngOnInit(): void {
    this.loadPendingPharmacies(); // Load data when component starts
  }

  loadPendingPharmacies() {
    this.adminService.getPendingPharmacies().subscribe({
      next: (data) => {
        this.pendingPharmacies = data;
      },
      error: (err) => {
        console.error('Error fetching pending pharmacies:', err);
        alert('Failed to load pending pharmacies.');
      },
    });
  }

  // Handle Approval (Status = true)
  approve(pharmacy: PendingPharmacy) {
    this.adminService.updatePharmacyStatus(pharmacy.id, true).subscribe({
      next: () => {
        alert(`Approved ${pharmacy.name}.`);
        this.loadPendingPharmacies(); // Reload the list to remove the approved pharmacy
      },
      error: (err) => {
        console.error('Approval failed:', err);
        alert('Approval failed. Check console.');
      },
    });
  }

  // Handle Rejection (Status = false)
  reject(pharmacy: PendingPharmacy) {
    // NOTE: In a real system, rejection might require a dedicated DELETE
    // or set a special 'IsDenied' flag. For simplicity, we set IsApproved=false
    this.adminService.updatePharmacyStatus(pharmacy.id, false).subscribe({
      next: () => {
        alert(`Rejected ${pharmacy.name}. Status set to NOT Approved.`);
        this.loadPendingPharmacies(); // Reload the list
      },
      error: (err) => {
        console.error('Rejection failed:', err);
        alert('Rejection failed. Check console.');
      },
    });
  }

  viewMedicines() {
    // TODO: Implement medicine viewing logic
    alert('Navigating to Medicine Management...');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect after logout
  }
}
