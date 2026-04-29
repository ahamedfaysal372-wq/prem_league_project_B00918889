import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth-guard';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Teams } from './pages/teams/teams';
import { TeamDetail } from './pages/team-detail/team-detail';
import { Players } from './pages/players/players';
import { Matches } from './pages/matches/matches';
import { Profile } from './pages/profile/profile';
import { Activity } from './pages/activity/activity';
import { Settings } from './pages/settings/settings';
import { About } from './pages/about/about';
import { Help } from './pages/help/help';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { ManageTeams } from './pages/admin/manage-teams/manage-teams';
import { ManagePlayers } from './pages/admin/manage-players/manage-players';
import { ManageMatches } from './pages/admin/manage-matches/manage-matches';

export const routes: Routes = [
  // Public
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Protected
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'teams', component: Teams, canActivate: [authGuard] },
  { path: 'teams/:id', component: TeamDetail, canActivate: [authGuard] },
  { path: 'players', component: Players, canActivate: [authGuard] },
  { path: 'matches', component: Matches, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'activity', component: Activity, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'about', component: About, canActivate: [authGuard] },
  { path: 'help', component: Help, canActivate: [authGuard] },
  { path: 'privacy', component: Privacy, canActivate: [authGuard] },
  { path: 'terms', component: Terms, canActivate: [authGuard] },

  // Admin only
  { path: 'admin', component: Dashboard, canActivate: [adminGuard] },
  { path: 'admin/teams', component: ManageTeams, canActivate: [adminGuard] },
  { path: 'admin/players', component: ManagePlayers, canActivate: [adminGuard] },
  { path: 'admin/matches', component: ManageMatches, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];