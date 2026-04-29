import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../services/teams';
import { MatchesService } from '../../services/matches';
import { PlayersService } from '../../services/players';
import { Match } from '../../models/match.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  table: any[] = [];
  recentMatches: Match[] = [];
  upcomingMatches: Match[] = [];
  liveMatches: Match[] = [];
  teamsMap: { [id: string]: string } = {};
  totalTeams = 0;
  totalPlayers = 0;
  totalMatches = 0;
  loading = true;
  error = '';
  seasonDropdownOpen = false;
  selectedSeason = '2025/26 Season';
  seasons = ['2025/26 Season', '2024/25 Season', '2023/24 Season'];

  currentSlide = 0;
  private carouselInterval: any;
  private pollInterval: any;
  carouselAnimating = false;

  slides = [
    {
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
      title: 'The Beautiful Game',
      subtitle: 'Follow every match, every goal, every moment of the 2025/26 Premier League season',
      cta: 'View Fixtures',
      link: '/matches'
    },
    {
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
      title: 'Premier League 2025/26',
      subtitle: 'Track your favourite clubs as they battle for the title across 38 matchdays',
      cta: 'See Teams',
      link: '/teams'
    },
    {
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
      title: 'World Class Players',
      subtitle: 'Browse stats, nationalities and performance data for every player in the league',
      cta: 'Browse Players',
      link: '/players'
    },
    {
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
      title: 'Live Match Centre',
      subtitle: 'Never miss a result — live scores, recent results and upcoming fixtures all in one place',
      cta: 'Match Centre',
      link: '/matches'
    }
  ];

  constructor(
    private teamsService: TeamsService,
    private matchesService: MatchesService,
    private playersService: PlayersService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.startCarousel();

    this.teamsService.getLeagueTable().subscribe({
      next: (res) => {
        this.table = res.table;
        this.totalTeams = res.table.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load league table';
        this.loading = false;
      }
    });

    this.teamsService.getTeams().subscribe({
      next: (res) => {
        res.results.forEach((team: any) => {
          this.teamsMap[team._id] = team.name;
        });
      }
    });

    this.matchesService.getMatches({ status: 'finished' }).subscribe({
      next: (res) => {
        this.recentMatches = res.results.slice(-3).reverse();
        this.totalMatches = res.results.length;
      }
    });

    this.matchesService.getMatches({ status: 'scheduled' }).subscribe({
      next: (res) => {
        this.upcomingMatches = res.results.slice(0, 3);
      }
    });

    this.playersService.getPlayers({ limit: 1 }).subscribe({
      next: (res) => { this.totalPlayers = res.total; }
    });

    this.loadLiveMatches();
    this.pollInterval = setInterval(() => this.loadLiveMatches(), 30000);
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  resetCarousel(): void {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetCarousel();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetCarousel();
  }

  onNextClick(): void {
    this.nextSlide();
    this.resetCarousel();
  }

  loadLiveMatches(): void {
    this.matchesService.getMatches({ status: 'live' }).subscribe({
      next: (res) => { this.liveMatches = res.results; },
      error: () => {}
    });
  }

  getTeamName(id: string): string {
    return this.teamsMap[id] || 'TBA';
  }

  getTeamInitials(id: string): string {
    const name = this.teamsMap[id] || '';
    return name.substring(0, 3).toUpperCase();
  }

  toggleSeasonDropdown(): void {
    this.seasonDropdownOpen = !this.seasonDropdownOpen;
  }

  selectSeason(season: string): void {
    this.selectedSeason = season;
    this.seasonDropdownOpen = false;
  }

  getGoalDiff(row: any): string {
    return row.gd > 0 ? '+' + row.gd : row.gd;
  }
}