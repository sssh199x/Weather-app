import {Component, inject, OnInit, ViewChild,} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {toggleDarkMode} from '../../../shared/utils/theme.utils';
import {ProfileComponent} from '../profile/profile.component';
import {CurrentWeatherComponent} from '../current-weather/current-weather.component';
import {CitySearchDialogComponent} from '../city-search-dialog/city-search-dialog.component';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../services/auth/auth.service';
import {DialogService} from '../../services/dialog/dialog.service';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    Button,
    Card,
    ProfileComponent,
    CurrentWeatherComponent,
    CitySearchDialogComponent,
    Toast,

  ],
  providers:[MessageService],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  toggleDarkMode= toggleDarkMode;


  private authService: AuthService = inject(AuthService);
  private dialogService: DialogService = inject(DialogService);


  ngOnInit() {
    // Check if user has any cities
    const user = this.authService.currentUserValue;

    // Show the dialog to add a city if the user has no cities
    if (user && (!user.cities || user.cities.length === 0)) {
      setTimeout(() => {
        this.openAddCityDialog();
      });
    }
  }

  openAddCityDialog() {
    this.dialogService.openAddCityDialog();
  }

}
