import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { TeamsService } from '../../services/teams';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  dropdownOpen = false;
  openFavTeam = false;

  teams: any[] = [];
  teamsMap: { [id: string]: string } = {};
  favouriteTeam = '';
  saveSuccess = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-wrapper')) {
        this.dropdownOpen = false;
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) this.loadData();
  }

  loadData(): void {
    const user = this.authService.getUser();
    this.favouriteTeam = user?.favourite_team_id || '';

    this.teamsService.getTeams().subscribe({
      next: (res) => {
        this.teams = res.results;
        res.results.forEach((t: any) => {
          this.teamsMap[t._id] = t.name;
        });
      }
    });
  }

  toggle(section: string): void {
    if (section === 'favteam') this.openFavTeam = !this.openFavTeam;
  }

  saveFavTeam(): void {
    const user = this.authService.getUser();
    if (!user) return;
    const updated: any = { ...user, favourite_team_id: this.favouriteTeam };
    this.authService.saveUser(updated);
    this.saveSuccess = true;
    setTimeout(() => { this.saveSuccess = false; }, 2500);
  }

  getFavouriteTeamName(): string {
    const team = this.teams.find(t => t._id === this.favouriteTeam);
    return team ? team.name : 'Not selected';
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  navigateTo(path: string): void {
    this.dropdownOpen = false;
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
}