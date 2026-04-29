import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatchesService } from '../../../services/matches';
import { TeamsService } from '../../../services/teams';
import { Match } from '../../../models/match.model';
import { Team } from '../../../models/team.model';

@Component({
  selector: 'app-manage-matches',
  imports: [NgIf, NgFor, FormsModule, RouterLink, DatePipe],
  templateUrl: './manage-matches.html',
  styleUrl: './manage-matches.css'
})
export class ManageMatches implements OnInit {
  matches: Match[] = [];
  teams: Team[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  showFinishForm = false;
  showUpdateScoreForm = false;
  finishingMatch: Match | null = null;
  updatingMatch: Match | null = null;

  stadiums = [
    'Old Trafford',
    'Anfield',
    'Emirates Stadium',
    'Stamford Bridge',
    'Etihad Stadium',
    'Tottenham Hotspur Stadium',
    'St. James\' Park',
    'Villa Park',
    'Goodison Park',
    'Molineux Stadium',
    'London Stadium',
    'Selhurst Park',
    'Brentford Community Stadium',
    'Amex Stadium',
    'Vitality Stadium',
    'Turf Moor',
    'Kenilworth Road',
    'Wembley Stadium',
    'King Power Stadium',
    'Bramall Lane',
    'Riverside Stadium',
    'Carrow Road',
    'St. Mary\'s Stadium',
    'Portman Road',
    'Craven Cottage',
  ];

  formData = {
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    stadium: ''
  };

  finishData = {
    home_goals: 0,
    away_goals: 0
  };

  updateScoreData = {
    home_goals: 0,
    away_goals: 0
  };

  constructor(
    private matchesService: MatchesService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => { this.teams = res.results; }
    });
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.matchesService.getMatches().subscribe({
      next: (res) => {
        this.matches = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  getTeamName(id: string): string {
    return this.teams.find(t => t._id === id)?.name || id;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAddForm(): void {
    this.formData = { home_team_id: '', away_team_id: '', match_date: '', stadium: '' };
    this.showForm = true;
    this.showFinishForm = false;
    this.showUpdateScoreForm = false;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  cancelForm(): void {
    this.showForm = false;
    this.showFinishForm = false;
    this.showUpdateScoreForm = false;
    this.finishingMatch = null;
    this.updatingMatch = null;
  }

  onSubmit(): void {
    if (!this.formData.home_team_id || !this.formData.away_team_id || !this.formData.match_date) {
      this.error = 'Please fill in all required fields';
      this.scrollToTop();
      return;
    }
    this.matchesService.createMatch(this.formData).subscribe({
      next: () => {
        this.success = 'Match created successfully!';
        this.showForm = false;
        this.loadMatches();
        this.scrollToTop();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to create match';
        this.scrollToTop();
      }
    });
  }

  startMatch(match: Match): void {
    if (!confirm(`Start match: ${this.getTeamName(match.home_team_id)} vs ${this.getTeamName(match.away_team_id)}?`)) return;
    this.matchesService.startMatch(match._id).subscribe({
      next: () => {
        this.success = 'Match is now LIVE!';
        this.loadMatches();
        this.scrollToTop();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to start match';
        this.scrollToTop();
      }
    });
  }

  openUpdateScoreForm(match: Match): void {
    this.updatingMatch = match;
    this.updateScoreData = {
      home_goals: match.score?.home_goals || 0,
      away_goals: match.score?.away_goals || 0
    };
    this.showUpdateScoreForm = true;
    this.showForm = false;
    this.showFinishForm = false;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  onUpdateScore(): void {
    if (!this.updatingMatch) return;
    this.matchesService.updateScore(this.updatingMatch._id, this.updateScoreData).subscribe({
      next: () => {
        this.success = 'Score updated!';
        this.showUpdateScoreForm = false;
        this.updatingMatch = null;
        this.loadMatches();
        this.scrollToTop();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update score';
        this.scrollToTop();
      }
    });
  }

  openFinishForm(match: Match): void {
    this.finishingMatch = match;
    this.finishData = {
      home_goals: match.score?.home_goals || 0,
      away_goals: match.score?.away_goals || 0
    };
    this.showFinishForm = true;
    this.showForm = false;
    this.showUpdateScoreForm = false;
    this.success = '';
    this.error = '';
    this.scrollToTop();
  }

  onFinishMatch(): void {
    if (!this.finishingMatch) return;
    this.matchesService.finishMatch(this.finishingMatch._id, this.finishData).subscribe({
      next: () => {
        this.success = 'Match finished and stats updated!';
        this.showFinishForm = false;
        this.finishingMatch = null;
        this.loadMatches();
        this.scrollToTop();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to finish match';
        this.scrollToTop();
      }
    });
  }

  deleteMatch(match: Match): void {
    if (!confirm('Are you sure you want to delete this match?')) return;
    this.matchesService.deleteMatch(match._id).subscribe({
      next: () => {
        this.success = 'Match deleted successfully!';
        this.loadMatches();
        this.scrollToTop();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to delete match';
        this.scrollToTop();
      }
    });
  }
}