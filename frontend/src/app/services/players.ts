import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getPlayers(filters?: { team_id?: string; position?: string; q?: string; page?: number; limit?: number }): Observable<any> {
    const query = new URLSearchParams();
    if (filters?.team_id) query.set('team_id', filters.team_id);
    if (filters?.position) query.set('position', filters.position);
    if (filters?.q) query.set('q', filters.q);
    if (filters?.page) query.set('page', filters.page.toString());
    if (filters?.limit) query.set('limit', filters.limit.toString());
    const params = query.toString() ? `?${query.toString()}` : '';
    return this.http.get(`${this.apiService.baseUrl}/players${params}`);
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiService.baseUrl}/players/${id}`);
  }

  createPlayer(data: any): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/players`, data);
  }

  updatePlayer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/players/${id}`, data);
  }

  deletePlayer(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/players/${id}`);
  }
}
