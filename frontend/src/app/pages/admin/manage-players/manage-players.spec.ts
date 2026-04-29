import { TestBed } from '@angular/core/testing';
import { ManagePlayers } from './manage-players';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManagePlayers', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePlayers],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ManagePlayers);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    const fixture = TestBed.createComponent(ManagePlayers);
    expect(fixture.componentInstance.loading).toBe(true);
  });
});