export interface User {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: 'admin' | 'user';
  favourite_team_id: string | null;
  created_at: string;
}