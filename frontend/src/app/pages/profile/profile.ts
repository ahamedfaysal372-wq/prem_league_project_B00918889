import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TeamsService } from '../../services/teams';
import { MatchesService } from '../../services/matches';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = null;
  teams: any[] = [];
  recentMatches: any[] = [];
  teamsMap: { [id: string]: string } = {};
  loading = false;
  success = '';
  error = '';

  // Accordion open states
  openFavTeam = false;
  openActivity = false;
  openSettings = false;

  displayName = '';
  email = '';
  favouriteTeam = '';

  constructor(
    public authService: AuthService,
    private teamsService: TeamsService,
    private matchesService: MatchesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.displayName = this.user.username || this.user.name || '';
      this.email = this.user.email || '';
      this.favouriteTeam = this.user.favourite_team_id || '';
    }

    this.teamsService.getTeams().subscribe({
      next: (res) => {
        this.teams = res.results;
        res.results.forEach((t: any) => {
          this.teamsMap[t._id] = t.name;
        });
      }
    });

    this.matchesService.getMatches({ status: 'finished' }).subscribe({
      next: (res) => {
        this.recentMatches = res.results.slice(-5).reverse();
      }
    });
  }

  toggle(section: string): void {
    if (section === 'favteam') this.openFavTeam = !this.openFavTeam;
    if (section === 'activity') this.openActivity = !this.openActivity;
    if (section === 'settings') this.openSettings = !this.openSettings;
  }

  saveProfile(): void {
    if (!this.displayName.trim()) {
      this.error = 'Display name cannot be empty';
      return;
    }
    this.loading = true;
    this.error = '';

    const updatedUser = {
      ...this.user,
      username: this.displayName,
      favourite_team_id: this.favouriteTeam
    };

    this.authService.saveUser(updatedUser);
    this.user = updatedUser;
    this.success = 'Profile updated!';
    this.loading = false;
    setTimeout(() => { this.success = ''; }, 3000);
  }

  getFavouriteTeamName(): string {
    const team = this.teams.find(t => t._id === this.favouriteTeam);
    return team ? team.name : 'Not selected';
  }

  getTeamName(id: string): string {
    return this.teamsMap[id] || 'TBA';
  }

  getInitial(): string {
    const name = this.user?.username || this.user?.name || '';
    return name.charAt(0).toUpperCase();
  }
}