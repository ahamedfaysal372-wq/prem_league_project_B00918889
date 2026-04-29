import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { ApiService } from './api';

export interface TeamsResponse {
  count: number;
  results: Team[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getTeams(city?: string): Observable<TeamsResponse> {
    const params = city ? `?city=${city}` : '';
    return this.http.get<TeamsResponse>(`${this.apiService.baseUrl}/teams${params}`);
  }

  getTeam(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiService.baseUrl}/teams/${id}`);
  }

  getLeagueTable(): Observable<any> {
    return this.http.get(`${this.apiService.baseUrl}/teams/table`);
  }

  createTeam(data: any): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/teams`, data);
  }

  updateTeam(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/teams/${id}`, data);
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/teams/${id}`);
  }
}