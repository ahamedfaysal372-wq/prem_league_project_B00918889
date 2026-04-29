import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.authService.getMe().subscribe({
          next: (user) => {
            if (user.role === 'admin') {
              user.username = 'Admin';
            } else {
              const username = localStorage.getItem('registered_username');
              if (username) user.username = username;
            }
            this.authService.saveUser(user);
            // Admin → admin panel, regular user → home
            this.router.navigate([user.role === 'admin' ? '/admin' : '/home']);
          }
        });
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}