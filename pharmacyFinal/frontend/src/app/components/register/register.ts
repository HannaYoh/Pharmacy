import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  role = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.error = '';

    const registerData = {
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      role: this.role,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        // ✅ AUTO-LOGIN AFTER REGISTER
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            const user = this.authService.getUser();
            this.navigateToDashboard(user!);
          },
          error: () => {
            this.error = 'Registration successful! Please login manually.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        this.error = err.error || 'Registration failed';
        this.loading = false;
      },
    });
  }

  private navigateToDashboard(user: User) {
    this.loading = false;
    switch (user.role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'pharmacyowner':
      case 'pharmacy-owner':
        this.router.navigate(['/pharmacy-owner']);
        break;
      default:
        this.router.navigate(['/customer']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
