import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  /*   onLogin() {
    this.loading = true;
    this.error = '';

    // ✅ FIXED: Match backend property names
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const user = this.authService.getUser();
        this.navigateToDashboard(user!);
      },
      error: (err) => {
        console.log('LOGIN ERROR:', err); // ← ADD THIS FOR DEBUG
        this.error = 'Invalid email or password';
        this.loading = false;
      },
    });
  }
 */
  onLogin() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // ✅ Use the response directly instead of calling getUser() immediately
        const user = {
          email: res.email,
          fullName: res.fullName,
          role: res.role,
          token: res.token,
        };

        // ✅ Save user to AuthService and localStorage
        localStorage.setItem('user', JSON.stringify(user));
        this.authService['currentUser'] = user;

        // ✅ Now safe to navigate
        this.navigateToDashboard(user);
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
        this.error = 'Invalid email or password';
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
        this.router.navigate(['/pharmacy-owner']);
        break;
      default:
        this.router.navigate(['/customer']);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
