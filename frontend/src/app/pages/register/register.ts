import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name = '';
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name || !this.username || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (this.username.length < 3) {
      this.error = 'Username must be at least 3 characters';
      return;
    }

    if (this.username.includes(' ')) {
      this.error = 'Username cannot contain spaces';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        localStorage.setItem('registered_username', this.username);
        this.success = 'Account created! Redirecting to login...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
        this.loading = false;
      }
    });
  }
}