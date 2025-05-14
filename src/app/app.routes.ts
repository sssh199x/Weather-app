import { Routes } from '@angular/router';
import {LoginScreenComponent} from './components/login-screen/login-screen.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {SettingsScreenComponent} from './components/settings-screen/settings-screen.component';
import {authGuard} from './guards/auth.guard';
import {ForecastWeatherComponent} from './components/forecast-weather/forecast-weather.component';

export const routes: Routes = [
  {
    path: '',
    title:'Login-Page',
    component:LoginScreenComponent,
    pathMatch: 'full',
  },
  {
    path: 'main-page',
    title:'Weather-Page',
    component:MainPageComponent,
    canActivate:[authGuard],
  },
  {
    path: 'settings',
    title:'Settings-Page',
    component:SettingsScreenComponent,
    canActivate:[authGuard],
  },
  {
    path: 'forecast-page/:id',
    title:'Forecast-Page',
    component:ForecastWeatherComponent,
    canActivate:[authGuard],
  },
  // Add a wildcard route for handling invalid URLs
  {
    path: '**',
    redirectTo: ''
  }
];
