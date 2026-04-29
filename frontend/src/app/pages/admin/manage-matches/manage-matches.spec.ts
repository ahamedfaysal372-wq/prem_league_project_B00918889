import { TestBed } from '@angular/core/testing';
import { ManageMatches } from './manage-matches';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManageMatches', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMatches],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ManageMatches);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    const fixture = TestBed.createComponent(ManageMatches);
    expect(fixture.componentInstance.loading).toBe(true);
  });
});