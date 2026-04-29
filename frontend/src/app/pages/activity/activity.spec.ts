import { TestBed } from '@angular/core/testing';
import { Activity } from './activity';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Activity', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activity],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Activity);
    const app = fixture.componentInstance as Activity;
    expect(app).toBeTruthy();
  });

  it('should have loading state initially', () => {
    const fixture = TestBed.createComponent(Activity);
    const app = fixture.componentInstance as Activity;
    expect(app.loading).toBe(true);
  });
});