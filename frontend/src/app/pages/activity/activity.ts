import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchesService } from '../../services/matches';
import { TeamsService } from '../../services/teams';

@Component({
  selector: 'app-activity',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './activity.html',
  styleUrl: './activity.css'
})
export class Activity implements OnInit {
  matches: any[] = [];
  teamsMap: { [id: string]: string } = {};
  loading = true;

  constructor(
    private matchesService: MatchesService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => {
        res.results.forEach((t: any) => {
          this.teamsMap[t._id] = t.name;
        });
      }
    });

    this.matchesService.getMatches({ status: 'finished' }).subscribe({
      next: (res) => {
        this.matches = res.results.reverse();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getTeamName(id: string): string {
    return this.teamsMap[id] || 'TBA';
  }

  getInitials(id: string): string {
    return this.getTeamName(id).substring(0, 3).toUpperCase();
  }
}