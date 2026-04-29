import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { TeamsService } from '../../../services/teams';
import { MatchesService } from '../../../services/matches';
import { PlayersService } from '../../../services/players';
import { Match } from '../../../models/match.model';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  totalTeams = 0;
  totalPlayers = 0;
  totalMatches = 0;
  scheduledMatches = 0;
  liveMatches: Match[] = [];
  recentMatches: Match[] = [];
  upcomingMatches: Match[] = [];
  teamsMap: { [id: string]: string } = {};
  loading = true;
  private pollInterval: any;

  constructor(
    public authService: AuthService,
    private teamsService: TeamsService,
    private matchesService: MatchesService,
    private playersService: PlayersService
  ) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => {
        this.totalTeams = res.results.length;
        res.results.forEach((t: any) => {
          this.teamsMap[t._id] = t.name;
        });
      }
    });

    this.playersService.getPlayers({ limit: 1 }).subscribe({
      next: (res) => { this.totalPlayers = res.total; }
    });

    this.matchesService.getMatches({ status: 'finished' }).subscribe({
      next: (res) => {
        this.totalMatches = res.results.length;
        this.recentMatches = res.results.slice(-3).reverse();
        this.loading = false;
      }
    });

    this.matchesService.getMatches({ status: 'scheduled' }).subscribe({
      next: (res) => {
        this.scheduledMatches = res.results.length;
        this.upcomingMatches = res.results.slice(0, 3);
      }
    });

    this.loadLiveMatches();
    this.pollInterval = setInterval(() => this.loadLiveMatches(), 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadLiveMatches(): void {
    this.matchesService.getMatches({ status: 'live' }).subscribe({
      next: (res) => { this.liveMatches = res.results; }
    });
  }

  getTeamName(id: string): string {
    return this.teamsMap[id] || 'TBA';
  }

  getTeamInitials(id: string): string {
    return (this.teamsMap[id] || '').substring(0, 3).toUpperCase();
  }
}