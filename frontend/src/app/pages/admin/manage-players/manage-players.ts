import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlayersService } from '../../../services/players';
import { TeamsService } from '../../../services/teams';
import { Player } from '../../../models/player.model';
import { Team } from '../../../models/team.model';

@Component({
  selector: 'app-manage-players',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './manage-players.html',
  styleUrl: './manage-players.css'
})
export class ManagePlayers implements OnInit {
  players: Player[] = [];
  teams: Team[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  editingPlayer: Player | null = null;
  searchQuery = '';
  selectedPosition = '';

  formData = {
    name: '',
    position: '',
    nationality: '',
    age: 0,
    squad_number: 0,
    team_id: ''
  };

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => { this.teams = res.results; }
    });
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playersService.getPlayers({
      q: this.searchQuery,
      position: this.selectedPosition,
      limit: 200
    }).subscribe({
      next: (res) => {
        this.players = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load players';
        this.loading = false;
      }
    });
  }

  onSearch(): void { this.loadPlayers(); }

  getTeamName(id: string): string {
    return this.teams.find(t => t._id === id)?.name || id;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAddForm(): void {
    this.editingPlayer = null;
    this.formData = { name: '', position: '', nationality: '', age: 0, squad_number: 0, team_id: '' };
    this.showForm = true;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  openEditForm(player: Player): void {
    this.editingPlayer = player;
    this.formData = {
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      age: player.age,
      squad_number: player.squad_number,
      team_id: player.team_id
    };
    this.showForm = true;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingPlayer = null;
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.position || !this.formData.nationality || !this.formData.team_id) {
      this.error = 'Please fill in all required fields';
      this.scrollToTop();
      return;
    }

    if (this.editingPlayer) {
      this.playersService.updatePlayer(this.editingPlayer._id, this.formData).subscribe({
        next: () => {
          this.success = 'Player updated successfully!';
          this.showForm = false;
          this.loadPlayers();
          this.scrollToTop();
        },
        error: () => {
          this.error = 'Failed to update player';
          this.scrollToTop();
        }
      });
    } else {
      this.playersService.createPlayer(this.formData).subscribe({
        next: () => {
          this.success = 'Player created successfully!';
          this.showForm = false;
          this.loadPlayers();
          this.scrollToTop();
        },
        error: () => {
          this.error = 'Failed to create player';
          this.scrollToTop();
        }
      });
    }
  }

  deletePlayer(player: Player): void {
    if (!confirm(`Are you sure you want to delete ${player.name}?`)) return;
    this.playersService.deletePlayer(player._id).subscribe({
      next: () => {
        this.success = 'Player deleted successfully!';
        this.loadPlayers();
        this.scrollToTop();
      },
      error: () => {
        this.error = 'Failed to delete player';
        this.scrollToTop();
      }
    });
  }
}