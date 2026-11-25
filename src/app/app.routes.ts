import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { FilmsComponent } from './pages/films/films.component';
import { AuthGuard } from './guards/auth.guard';
import { SurveillanceComponent } from './pages/surveillance/surveillance.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'films', component: FilmsComponent, canActivate: [AuthGuard] },
  { path: 'surveillance', component: SurveillanceComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }

];
