export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

export interface Player {
  _id: string;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  nationality: string;
  age: number;
  squad_number: number;
  team_id: string;
  stats: PlayerStats;
  created_at: string;
}