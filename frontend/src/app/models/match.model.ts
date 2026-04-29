export interface Score {
  home_goals: number;
  away_goals: number;
}

export interface Match {
  _id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  stadium: string;
  status: 'scheduled' | 'live' | 'finished';
  score: Score | null;
  created_at: string;
  finished_at: string | null;
  started_at?: string | null;
}