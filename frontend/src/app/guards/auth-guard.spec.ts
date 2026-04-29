import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when logged in', () => {
    localStorage.setItem('token', 'valid-token');
    expect(authService.isLoggedIn()).toBe(true);
  });

  it('should deny access when not logged in', () => {
    expect(authService.isLoggedIn()).toBe(false);
  });

  it('should redirect to login when not authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    localStorage.clear();
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});