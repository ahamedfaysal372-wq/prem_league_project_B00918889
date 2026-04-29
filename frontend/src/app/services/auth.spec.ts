import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no token exists', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return false when not logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should save and retrieve token on login', () => {
    service.login({ email: 'admin@test.com', password: 'secret123' }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ access_token: 'test-token-123' });
    expect(service.getToken()).toBe('test-token-123');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should clear token on logout', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should save and retrieve user', () => {
    const mockUser = {
      _id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin' as const,
      favourite_team_id: null,
      created_at: '2026-01-01'
    };
    service.saveUser(mockUser);
    expect(service.getUser()).toEqual(mockUser);
  });

  it('should return true for admin user', () => {
    const mockUser = {
      _id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin' as const,
      favourite_team_id: null,
      created_at: '2026-01-01'
    };
    service.saveUser(mockUser);
    expect(service.isAdmin()).toBe(true);
  });

  it('should return false for regular user', () => {
    const mockUser = {
      _id: '2',
      name: 'User',
      email: 'user@test.com',
      role: 'user' as const,
      favourite_team_id: null,
      created_at: '2026-01-01'
    };
    service.saveUser(mockUser);
    expect(service.isAdmin()).toBe(false);
  });

  it('should make POST request to register endpoint', () => {
    const registerData = {
      name: 'Test',
      username: 'test',
      email: 'test@test.com',
      password: 'secret123'
    };
    service.register(registerData).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush({ message: 'registered' });
  });

  it('should make GET request to /auth/me endpoint', () => {
    service.getMe().subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush({
      _id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin',
      favourite_team_id: null,
      created_at: '2026-01-01'
    });
  });
});