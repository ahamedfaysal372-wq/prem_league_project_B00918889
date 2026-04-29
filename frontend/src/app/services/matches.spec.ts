import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatchesService } from './matches';

const mockMatch = {
  _id: '1',
  home_team_id: '1',
  away_team_id: '2',
  match_date: '2026-04-01T15:00:00Z',
  stadium: 'Emirates',
  status: 'scheduled' as const,
  score: null,
  created_at: '2026-01-01',
  finished_at: null
};

describe('MatchesService', () => {
  let service: MatchesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        MatchesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MatchesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all matches', () => {
    service.getMatches().subscribe((res: any) => {
      expect(res.count).toBe(1);
      expect(res.results[0].status).toBe('scheduled');
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/matches');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 1, results: [mockMatch] });
  });

  it('should GET matches filtered by status', () => {
    service.getMatches({ status: 'finished' }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches?status=finished');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, results: [] });
  });

  it('should GET matches filtered by team_id', () => {
    service.getMatches({ team_id: 'abc123' }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches?team_id=abc123');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, results: [] });
  });

  it('should GET a single match by ID', () => {
    const finishedMatch = {
      ...mockMatch,
      status: 'finished' as const,
      score: { home_goals: 2, away_goals: 1 },
      finished_at: '2026-04-01'
    };

    service.getMatch('1').subscribe(match => {
      expect(match.status).toBe('finished');
      expect(match.score?.home_goals).toBe(2);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/matches/1');
    expect(req.request.method).toBe('GET');
    req.flush(finishedMatch);
  });

  it('should POST to create a match', () => {
    const newMatch = {
      home_team_id: '1',
      away_team_id: '2',
      match_date: '2026-05-01T15:00:00Z',
      stadium: 'Emirates'
    };

    service.createMatch(newMatch).subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:5000/matches');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMatch);
    req.flush({ message: 'match created', match_id: '123' });
  });

  it('should PUT to start a match', () => {
    service.startMatch('1').subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches/1/start');
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'match is now live' });
  });

  it('should PUT to update score', () => {
    service.updateScore('1', { home_goals: 2, away_goals: 1 }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches/1/update-score');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ home_goals: 2, away_goals: 1 });
    req.flush({ message: 'score updated' });
  });

  it('should PUT to finish a match', () => {
    service.finishMatch('1', { home_goals: 3, away_goals: 0 }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches/1/finish');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ home_goals: 3, away_goals: 0 });
    req.flush({ message: 'match finished and team stats updated' });
  });

  it('should DELETE a match', () => {
    service.deleteMatch('1').subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/matches/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'match deleted' });
  });
});