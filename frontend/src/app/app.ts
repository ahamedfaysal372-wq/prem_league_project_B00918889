import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { AuthService } from './services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private publicRoutes = ['/', '/login', '/register'];
  currentRoute = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  get showNavbar(): boolean {
    return !this.publicRoutes.includes(this.currentRoute);
  }

  get showFooter(): boolean {
    return !this.publicRoutes.includes(this.currentRoute);
  }

  isAuthPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }

  isFullBleed(): boolean {
    return this.currentRoute === '/home' || this.currentRoute === '/';
  }
}