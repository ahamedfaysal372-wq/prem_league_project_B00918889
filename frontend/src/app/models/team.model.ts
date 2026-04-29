export interface Stadium {
  name: string;
  capacity: number;
}

export interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  points: number;
}

export interface Team {
  _id: string;
  name: string;
  short_name: string;
  city: string;
  manager: string;
  founded: number | null;
  colours: string[];
  stadium: Stadium;
  stats: TeamStats;
  created_at: string;
}