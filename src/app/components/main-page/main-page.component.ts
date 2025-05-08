import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Menu} from 'primeng/menu';
import {toggleDarkMode} from '../../../shared/utils/theme.utils';
import {ProfileComponent} from '../profile/profile.component';


@Component({
  selector: 'app-main-page',
  imports: [
    Button,
    Card,
    ProfileComponent,

  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  toggleDarkMode= toggleDarkMode;

}
