import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../../services/teams';
import { Team } from '../../../models/team.model';

@Component({
  selector: 'app-manage-teams',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './manage-teams.html',
  styleUrl: './manage-teams.css'
})
export class ManageTeams implements OnInit {
  teams: Team[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  editingTeam: Team | null = null;

  formData = {
    name: '',
    short_name: '',
    city: '',
    manager: '',
    stadium_name: '',
    stadium_capacity: 0
  };

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void { this.loadTeams(); }

  loadTeams(): void {
    this.loading = true;
    this.teamsService.getTeams().subscribe({
      next: (res) => { this.teams = res.results; this.loading = false; },
      error: () => { this.error = 'Failed to load teams'; this.loading = false; }
    });
  }

  scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  openAddForm(): void {
    this.editingTeam = null;
    this.formData = { name: '', short_name: '', city: '', manager: '', stadium_name: '', stadium_capacity: 0 };
    this.showForm = true;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  openEditForm(team: Team): void {
    this.editingTeam = team;
    this.formData = {
      name: team.name,
      short_name: team.short_name,
      city: team.city,
      manager: team.manager,
      stadium_name: team.stadium.name,
      stadium_capacity: team.stadium.capacity
    };
    this.showForm = true;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingTeam = null;
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.city) {
      this.error = 'Name and city are required';
      this.scrollToTop();
      return;
    }
    const data = {
      name: this.formData.name,
      short_name: this.formData.short_name,
      city: this.formData.city,
      manager: this.formData.manager,
      stadium: {
        name: this.formData.stadium_name,
        capacity: this.formData.stadium_capacity
      }
    };
    if (this.editingTeam) {
      this.teamsService.updateTeam(this.editingTeam._id, data).subscribe({
        next: () => { this.success = 'Team updated successfully!'; this.showForm = false; this.loadTeams(); this.scrollToTop(); },
        error: () => { this.error = 'Failed to update team'; this.scrollToTop(); }
      });
    } else {
      this.teamsService.createTeam(data).subscribe({
        next: () => { this.success = 'Team created successfully!'; this.showForm = false; this.loadTeams(); this.scrollToTop(); },
        error: () => { this.error = 'Failed to create team'; this.scrollToTop(); }
      });
    }
  }

  deleteTeam(team: Team): void {
    if (!confirm(`Are you sure you want to delete ${team.name}?`)) return;
    this.teamsService.deleteTeam(team._id).subscribe({
      next: () => { this.success = 'Team deleted successfully!'; this.loadTeams(); this.scrollToTop(); },
      error: () => { this.error = 'Failed to delete team'; this.scrollToTop(); }
    });
  }
}