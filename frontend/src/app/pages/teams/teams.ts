import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../services/teams';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-teams',
  imports: [NgIf, NgFor, RouterLink, DecimalPipe],
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class Teams implements OnInit {
  teams: Team[] = [];
  loading = true;
  error = '';

  private cardImages = [
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
    'https://images.unsplash.com/photo-1504016798967-59a258cca854?w=800&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    'https://images.unsplash.com/photo-1490133861116-bf54a0e68b63?w=800&q=80',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc4f5f5925?w=800&q=80',
    'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&q=80',
  ];

  private overlayColors = [
    'linear-gradient(to top, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.2) 100%)',
    'linear-gradient(to top, rgba(0,40,80,0.97) 0%, rgba(0,40,80,0.55) 50%, rgba(0,40,80,0.15) 100%)',
    'linear-gradient(to top, rgba(80,10,10,0.97) 0%, rgba(80,10,10,0.55) 50%, rgba(80,10,10,0.15) 100%)',
    'linear-gradient(to top, rgba(0,60,40,0.97) 0%, rgba(0,60,40,0.55) 50%, rgba(0,60,40,0.15) 100%)',
    'linear-gradient(to top, rgba(50,0,80,0.97) 0%, rgba(50,0,80,0.55) 50%, rgba(50,0,80,0.15) 100%)',
    'linear-gradient(to top, rgba(70,35,0,0.97) 0%, rgba(70,35,0,0.55) 50%, rgba(70,35,0,0.15) 100%)',
    'linear-gradient(to top, rgba(0,50,70,0.97) 0%, rgba(0,50,70,0.55) 50%, rgba(0,50,70,0.15) 100%)',
    'linear-gradient(to top, rgba(60,0,40,0.97) 0%, rgba(60,0,40,0.55) 50%, rgba(60,0,40,0.15) 100%)',
    'linear-gradient(to top, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.2) 100%)',
    'linear-gradient(to top, rgba(0,60,30,0.97) 0%, rgba(0,60,30,0.55) 50%, rgba(0,60,30,0.15) 100%)',
    'linear-gradient(to top, rgba(70,20,0,0.97) 0%, rgba(70,20,0,0.55) 50%, rgba(70,20,0,0.15) 100%)',
  ];

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe({
      next: (res) => {
        this.teams = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load teams';
        this.loading = false;
      }
    });
  }

  getCardImage(index: number): string {
    return this.cardImages[index % this.cardImages.length];
  }

  getOverlay(index: number): string {
    return this.overlayColors[index % this.overlayColors.length];
  }
}