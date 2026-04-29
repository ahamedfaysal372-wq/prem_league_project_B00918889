import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TeamsService } from './teams';

const mockTeam = {
  _id: '1',
  name: 'Arsenal FC',
  city: 'London',
  short_name: 'ARS',
  manager: 'Arteta',
  founded: null,
  colours: [],
  stadium: { name: 'Emirates', capacity: 60000 },
  stats: { played: 28, wins: 17, draws: 5, losses: 6, gf: 54, ga: 29, points: 56 },
  created_at: '2026-01-01'
};

describe('TeamsService', () => {
  let service: TeamsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TeamsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all teams', () => {
    service.getTeams().subscribe(res => {
      expect(res.count).toBe(1);
      expect(res.results.length).toBe(1);
      expect(res.results[0].name).toBe('Arsenal FC');
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 1, results: [mockTeam] });
  });

  it('should GET teams filtered by city', () => {
    service.getTeams('London').subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/teams?city=London');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, results: [] });
  });

  it('should GET a single team by ID', () => {
    service.getTeam('1').subscribe(team => {
      expect(team.name).toBe('Arsenal FC');
      expect(team._id).toBe('1');
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeam);
  });

  it('should GET league table', () => {
    const mockTable = {
      table: [{
        team_id: '1',
        name: 'Arsenal FC',
        played: 28,
        wins: 17,
        draws: 5,
        losses: 6,
        gf: 54,
        ga: 29,
        gd: 25,
        points: 56
      }]
    };

    service.getLeagueTable().subscribe((res: any) => {
      expect(res.table.length).toBe(1);
      expect(res.table[0].points).toBe(56);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams/table');
    expect(req.request.method).toBe('GET');
    req.flush(mockTable);
  });

  it('should POST to create a team', () => {
    const newTeam = {
      name: 'Test FC',
      city: 'Dublin',
      short_name: 'TES',
      stadium: { name: 'Test Arena', capacity: 10000 }
    };

    service.createTeam(newTeam).subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTeam);
    req.flush({ message: 'team created', team_id: '123' });
  });

  it('should PUT to update a team', () => {
    const updateData = { manager: 'New Manager' };

    service.updateTeam('1', updateData).subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush({ message: 'team updated' });
  });

  it('should DELETE a team', () => {
    service.deleteTeam('1').subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:5000/teams/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'team deleted' });
  });
});