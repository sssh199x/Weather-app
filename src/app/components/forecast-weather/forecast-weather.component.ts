import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth/auth.service';
import { WeatherService } from '../../services/weather/weather.service';
import { ForecastDay } from '../../models/weather.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forecast-weather',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    ChartModule,
    ProgressSpinnerModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    DividerModule
  ],
  templateUrl: './forecast-weather.component.html',
  styleUrl: './forecast-weather.component.css'
})
export class ForecastWeatherComponent implements OnInit, OnDestroy {
  // City Information
  cityName: string | null = null;
  countryCode: string | null = null;

  // Forecast Data
  forecastData: ForecastDay[] = [];

  // Loading & Error States
  loading: boolean = true;
  error: boolean = false;

  // Chart Data
  temperatureChartData: any;
  temperatureChartOptions: any;

  // Unit Settings
  temperatureUnit: 'metric' | 'imperial' = 'metric';
  unitSymbol: string = '°C';

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get city from route parameter
    this.cityName = this.route.snapshot.paramMap.get('id');

    // Get user's temperature unit preference
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.temperatureUnit = user.temperatureUnit;
          this.unitSymbol = this.temperatureUnit === 'metric' ? '°C' : '°F';

          // Load forecast if city name is available
          if (this.cityName) {
            this.loadForecast();
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadForecast() {
    this.loading = true;
    this.error = false;

    if (!this.cityName) return;

    this.weatherService.getForecast(this.cityName, this.temperatureUnit).subscribe({
      next: (data) => {
        this.forecastData = data;
        this.loading = false;
        console.log('Forecast data:', data);

        // Extract country code from the first day if available
        if (data.length > 0 && data[0]) {
          this.countryCode = data[0].countryCode;
        }

        // Prepare temperature chart
        this.prepareTemperatureChart();
      },
      error: (err) => {
        console.error('Error loading forecast:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  prepareTemperatureChart() {
    // Extract days and temperature data
    const labels = this.forecastData.map(day => day.dayOfWeek);
    const maxTemps = this.forecastData.map(day => day.tempMax);
    const minTemps = this.forecastData.map(day => day.tempMin);

    // Create chart data
    this.temperatureChartData = {
      labels: labels,
      datasets: [
        {
          label: `Max (${this.unitSymbol})`,
          data: maxTemps,
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
          backgroundColor: 'rgba(255, 167, 38, 0.2)'
        },
        {
          label: `Min (${this.unitSymbol})`,
          data: minTemps,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
          backgroundColor: 'rgba(66, 165, 245, 0.2)'
        }
      ]
    };

    // Chart options
    this.temperatureChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          },
          title: {
            display: true,
            text: `Temperature (${this.unitSymbol})`
          }
        }
      }
    };
  }

  // Navigate back to main page
  goBack() {
    this.router.navigate(['/main-page']);
  }

  // Helper methods for the template
  getWeatherIconUrl(iconCode: string): string {
    return this.weatherService.getIconUrl(iconCode);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Get appropriate class for weather condition
  getWeatherClass(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'clear': return 'weather-clear';
      case 'clouds': return 'weather-clouds';
      case 'rain': return 'weather-rain';
      case 'drizzle': return 'weather-drizzle';
      case 'thunderstorm': return 'weather-thunderstorm';
      case 'snow': return 'weather-snow';
      case 'mist':
      case 'haze':
      case 'fog': return 'weather-mist';
      default: return 'weather-default';
    }
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
