import { TestBed } from '@angular/core/testing';
import { Help } from './help';
import { provideRouter } from '@angular/router';

describe('Help', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Help],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Help);
    expect(fixture.componentInstance).toBeTruthy();
  });
});