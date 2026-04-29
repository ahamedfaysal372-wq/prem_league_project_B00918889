import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayersService } from '../../services/players';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-players',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class Players implements OnInit {
  players: Player[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  selectedPosition = '';
  page = 1;
  totalPages = 1;
  total = 0;

  constructor(private playersService: PlayersService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playersService.getPlayers({
      q: this.searchQuery,
      position: this.selectedPosition,
      page: this.page,
      limit: 10
    }).subscribe({
      next: (res) => {
        this.players = res.results;
        this.totalPages = res.total_pages;
        this.total = res.total;
        this.loading = false;
      },
      error: (_err) => {
        this.error = 'Failed to load players';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadPlayers();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPlayers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPlayers();
    }
  }
}
