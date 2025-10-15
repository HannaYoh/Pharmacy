import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onRegister() {
    alert('Registration logic will be implemented later.');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
