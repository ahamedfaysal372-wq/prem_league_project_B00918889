import { TestBed } from '@angular/core/testing';
import { Settings } from './settings';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Settings', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Settings);
    const app = fixture.componentInstance as Settings;
    expect(app).toBeTruthy();
  });

  it('should have empty fields initially', () => {
    const fixture = TestBed.createComponent(Settings);
    const app = fixture.componentInstance as Settings;
    expect(app.displayName).toBe('');
    expect(app.favouriteTeam).toBe('');
  });
});