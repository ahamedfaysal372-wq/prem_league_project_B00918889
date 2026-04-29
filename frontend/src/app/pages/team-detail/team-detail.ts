import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, DecimalPipe } from '@angular/common';
import { TeamsService } from '../../services/teams';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-detail',
  imports: [NgIf, RouterLink, DecimalPipe],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css'
})
export class TeamDetail implements OnInit {
  team: Team | null = null;
  loading = true;
  error = '';
  teamIndex = 0;

  private cardImages = [
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1600&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
    'https://images.unsplash.com/photo-1504016798967-59a258cca854?w=1600&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&q=80',
    'https://images.unsplash.com/photo-1490133861116-bf54a0e68b63?w=1600&q=80',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc4f5f5925?w=1600&q=80',
    'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1600&q=80',
  ];

  private overlayColors = [
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(0,80,40,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(0,40,100,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(100,0,0,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(80,40,0,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(60,0,80,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(0,60,80,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(80,0,40,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(0,80,60,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(60,60,0,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(0,40,80,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(80,20,0,0.85) 100%)',
  ];

  constructor(
    private route: ActivatedRoute,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teamsService.getTeams().subscribe({
        next: (res) => {
          this.teamIndex = res.results.findIndex((t: Team) => t._id === id);
        }
      });
      this.teamsService.getTeam(id).subscribe({
        next: (team) => {
          this.team = team;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load team';
          this.loading = false;
        }
      });
    }
  }

  getHeaderImage(): string {
    return this.cardImages[this.teamIndex % this.cardImages.length];
  }

  getHeaderOverlay(): string {
    return this.overlayColors[this.teamIndex % this.overlayColors.length];
  }

  getGoalDiff(): number {
    if (!this.team) return 0;
    return this.team.stats.gf - this.team.stats.ga;
  }

  getWinRate(): number {
    if (!this.team || this.team.stats.played === 0) return 0;
    return Math.round((this.team.stats.wins / this.team.stats.played) * 100);
  }
}