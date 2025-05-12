import { Routes } from '@angular/router';
import {ProfileComponent} from './components/profile/profile.component';
import {LoginScreenComponent} from './components/login-screen/login-screen.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {SettingsScreenComponent} from './components/settings-screen/settings-screen.component';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component:LoginScreenComponent,
    pathMatch: 'full',
  },
  {
    path: 'main-page',
    component:MainPageComponent,
    canActivate:[authGuard],
  },
  {
    path: 'settings',
    component:SettingsScreenComponent,
    canActivate:[authGuard],
  },

  // Add a wildcard route for handling invalid URLs
  {
    path: '**',
    redirectTo: ''
  }

];
