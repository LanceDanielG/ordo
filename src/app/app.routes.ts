import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard, loginGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
];
