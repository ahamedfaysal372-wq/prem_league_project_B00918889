import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getMatches(filters?: { status?: string; team_id?: string }): Observable<any> {
    const query = new URLSearchParams();
    if (filters?.status) query.set('status', filters.status);
    if (filters?.team_id) query.set('team_id', filters.team_id);
    const params = query.toString() ? `?${query.toString()}` : '';
    return this.http.get(`${this.apiService.baseUrl}/matches${params}`);
  }

  getMatch(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiService.baseUrl}/matches/${id}`);
  }

  createMatch(data: any): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/matches`, data);
  }

  startMatch(id: string): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/matches/${id}/start`, {});
  }

  updateScore(id: string, data: { home_goals: number; away_goals: number }): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/matches/${id}/update-score`, data);
  }

  finishMatch(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/matches/${id}/finish`, data);
  }

  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/matches/${id}`);
  }
}