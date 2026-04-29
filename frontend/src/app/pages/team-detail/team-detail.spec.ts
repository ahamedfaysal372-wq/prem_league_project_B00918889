import { TestBed } from '@angular/core/testing';
import { TeamDetail } from './team-detail';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TeamDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TeamDetail);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    const fixture = TestBed.createComponent(TeamDetail);
    expect(fixture.componentInstance.loading).toBe(true);
  });
});