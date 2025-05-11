import {Component, OnDestroy, OnInit,} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {WeatherService} from '../../services/weather/weather.service';
import {Subscription} from 'rxjs';
import {DialogService} from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-city-search-dialog',
  standalone: true,
  imports: [
    Dialog,
    Button,
    InputText,
    DropdownModule,
    ReactiveFormsModule,
    NgIf,
    Toast

  ],
  providers: [MessageService],
  templateUrl: './city-search-dialog.component.html',
  styleUrls: ['./city-search-dialog.component.css']
})
export class CitySearchDialogComponent implements OnInit ,OnDestroy {
  visible = false;
  cityForm!: FormGroup;
  isLoading = false;

  private subscription = new Subscription();


  unitOptions = [
    {label: 'Celsius (°C)', value: 'metric'},
    {label: 'Fahrenheit (°F)', value: 'imperial'}
  ];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private weatherService: WeatherService,
    private messageService: MessageService,
    private dialogService: DialogService,
  ) {
    this.cityForm = this.fb.group({
      cityName: ['', [Validators.required]],
      unit: ['metric', [Validators.required]]
    });
  }

  ngOnInit() {
    // Subscribe to dialog open events
    this.subscription.add(
      this.dialogService.openAddCityDialog$.subscribe(() => {
        this.showDialog();
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions when component is destroyed
    this.subscription.unsubscribe();
  }

  showDialog() {
    this.visible = true;
    this.cityForm.reset({
      cityName: '',
      unit: 'metric'
    });
  }

  hideDialog() {
    this.visible = false;
  }

  saveCity() {
    if (this.cityForm.invalid) {
      // Mark fields as touched to show validation errors
      this.cityForm.markAllAsTouched();
      return;
    }

    const cityName = this.cityForm.get('cityName')?.value;
    const unit = this.cityForm.get('unit')?.value;

    // Set loading state
    this.isLoading = true;

    // Verify city exists by making an API call first
    this.weatherService.getCurrentWeather(cityName, unit).subscribe({
      next: (weatherData) => {
        // Weather data retrieved successfully, city exists

        // Save city to user's list
        this.authService.addCity(cityName);

        // Update user's temperature unit preference
        this.authService.updateUserPreferences({temperatureUnit: unit});

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'City Added',
          detail: `${cityName} has been added to your list.`
        });

        this.isLoading = false;
        this.hideDialog();
      },
      error: (error) => {
        // Show error message if city doesn't exist
        this.messageService.add({
          severity: 'error',
          summary: 'City Not Found',
          detail: 'Could not find weather data for this city. Please check the spelling and try again.'
        });
        this.isLoading = false;
      }
    });
  }
}
