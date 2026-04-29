import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TeamsService } from '../../services/teams';

@Component({
  selector: 'app-settings',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  user: any = null;
  teams: any[] = [];
  loading = false;
  success = '';
  error = '';

  displayName = '';
  email = '';
  favouriteTeam = '';

  constructor(
    private authService: AuthService,
    private teamsService: TeamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.displayName = this.user.username || this.user.name || '';
      this.email = this.user.email || '';
      this.favouriteTeam = this.user.favourite_team_id || '';
    }

    this.teamsService.getTeams().subscribe({
      next: (res) => { this.teams = res.results; }
    });
  }

  saveProfile(): void {
    if (!this.displayName.trim()) {
      this.error = 'Display name cannot be empty';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.loading = true;
    this.error = '';

    const updated: any = {
      ...this.user,
      username: this.displayName,
      favourite_team_id: this.favouriteTeam
    };

    this.authService.saveUser(updated);
    this.user = updated;
    this.success = 'Profile updated successfully!';
    this.loading = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { this.success = ''; }, 3000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getInitial(): string {
    return (this.user?.username || this.user?.name || '').charAt(0).toUpperCase();
  }

  getFavouriteTeamName(): string {
    const team = this.teams.find(t => t._id === this.favouriteTeam);
    return team ? team.name : 'Not selected';
  }
}