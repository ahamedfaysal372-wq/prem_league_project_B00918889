import { TestBed } from '@angular/core/testing';
import { ManageTeams } from './manage-teams';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManageTeams', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTeams],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ManageTeams);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    const fixture = TestBed.createComponent(ManageTeams);
    expect(fixture.componentInstance.loading).toBe(true);
  });
});