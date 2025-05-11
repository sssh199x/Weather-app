import {Component, inject} from '@angular/core';
import {MeterGroup,} from 'primeng/metergroup';
import {Card} from 'primeng/card';
import {NgForOf} from "@angular/common";
import {Button} from "primeng/button";
import {DialogService} from '../../services/dialog/dialog.service';


@Component({
  selector: 'app-current-weather',
  imports: [
    Button,
    MeterGroup,
    Card,
    NgForOf
  ],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css'
})
export class CurrentWeatherComponent {

  private dialogService: DialogService = inject(DialogService);


  value = [
    {label: 'Current temperature', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-sun'},
    {label: 'Expected High Temperature', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-cloud'},
    {label: 'Expected Low Temperature', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-cloud'},
    {label: 'Overcast state', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-sparkles'}
  ];


  onAddCityClick() {
    this.dialogService.openAddCityDialog();
  }
}
