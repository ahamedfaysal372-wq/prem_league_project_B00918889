import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchesService } from '../../services/matches';
import { TeamsService } from '../../services/teams';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-matches',
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  templateUrl: './matches.html',
  styleUrl: './matches.css'
})
export class Matches implements OnInit, OnDestroy {
  matches: Match[] = [];
  liveMatches: Match[] = [];
  teamsMap: { [id: string]: string } = {};
  loading = true;
  error = '';
  selectedStatus = '';
  private pollInterval: any;

  constructor(
    private matchesService: MatchesService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => {
        res.results.forEach((team: Team) => {
          this.teamsMap[team._id] = team.name;
        });
        this.loadMatches();
        this.loadLiveMatches();
      },
      error: () => {
        this.loadMatches();
        this.loadLiveMatches();
      }
    });

    // Poll for live matches every 30 seconds
    this.pollInterval = setInterval(() => {
      this.loadLiveMatches();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  loadMatches(): void {
    this.loading = true;
    this.matchesService.getMatches({ status: this.selectedStatus }).subscribe({
      next: (res) => {
        this.matches = res.results.filter((m: Match) => m.status !== 'live');
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  loadLiveMatches(): void {
    this.matchesService.getMatches({ status: 'live' }).subscribe({
      next: (res) => {
        this.liveMatches = res.results;
      },
      error: () => {}
    });
  }

  getTeamName(id: string): string {
    return this.teamsMap[id] || id;
  }

  getTeamInitials(id: string): string {
    const name = this.teamsMap[id] || '';
    return name.substring(0, 3).toUpperCase();
  }

  get finishedCount(): number {
    return this.matches.filter(m => m.status === 'finished').length;
  }

  get scheduledCount(): number {
    return this.matches.filter(m => m.status === 'scheduled').length;
  }

  onFilterChange(): void {
    this.loadMatches();
  }
}