import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PlayersService } from './players';

const mockPlayer = {
  _id: '1',
  name: 'Mohamed Salah',
  position: 'FW',
  nationality: 'Egyptian',
  age: 32,
  squad_number: 11,
  team_id: '2',
  stats: {
    appearances: 28,
    goals: 20,
    assists: 12,
    yellow_cards: 1,
    red_cards: 0
  },
  created_at: '2026-01-01'
};

describe('PlayersService', () => {
  let service: PlayersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PlayersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PlayersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all players', () => {
    service.getPlayers({}).subscribe(res => {
      expect(res.total).toBe(1);
      expect(res.results[0].name).toBe('Mohamed Salah');
    });

    const req = httpMock.expectOne(r => r.url === 'http://127.0.0.1:5000/players');
    expect(req.request.method).toBe('GET');
    req.flush({
      page: 1, limit: 20, total: 1,
      total_pages: 1, count: 1,
      results: [mockPlayer]
    });
  });

  it('should GET players filtered by position', () => {
    service.getPlayers({ position: 'FW' }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/players?position=FW');
    expect(req.request.method).toBe('GET');
    req.flush({ page: 1, limit: 20, total: 0, total_pages: 0, count: 0, results: [] });
  });

  it('should GET players filtered by search query', () => {
    service.getPlayers({ q: 'Salah' }).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/players?q=Salah');
    expect(req.request.method).toBe('GET');
    req.flush({ page: 1, limit: 20, total: 0, total_pages: 0, count: 0, results: [] });
  });

  it('should GET a single player by ID', () => {
    service.getPlayer('1').subscribe(player => {
      expect(player.name).toBe('Mohamed Salah');
    });
    const req = httpMock.expectOne('http://127.0.0.1:5000/players/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayer);
  });

  it('should POST to create a player', () => {
    const newPlayer = {
      name: 'Test Player',
      position: 'MF',
      nationality: 'Irish',
      age: 24,
      squad_number: 8,
      team_id: '1'
    };
    service.createPlayer(newPlayer).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/players');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlayer);
    req.flush({ message: 'player created', player_id: '123' });
  });

  it('should PUT to update a player', () => {
    const updateData = { age: 25, position: 'FW' };
    service.updatePlayer('1', updateData).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/players/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush({ message: 'player updated' });
  });

  it('should DELETE a player', () => {
    service.deletePlayer('1').subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:5000/players/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'player deleted' });
  });
});