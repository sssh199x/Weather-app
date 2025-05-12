import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {MeterGroup,} from 'primeng/metergroup';
import {Card} from 'primeng/card';
import {Button} from "primeng/button";
import {DialogService} from '../../services/dialog/dialog.service';
import {AuthService} from '../../services/auth/auth.service';
import {WeatherService} from '../../services/weather/weather.service';
import {WeatherData} from '../../models/weather.model';
import {Subscription} from 'rxjs';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Avatar} from 'primeng/avatar';
import {OverlayBadge} from 'primeng/overlaybadge';
import {City} from '../../models/user';
import {Divider} from 'primeng/divider';

interface CityWeather {
  city: City;
  weatherData: WeatherData | null;
  loading: boolean;
  error: boolean;
  values: any[];
}

@Component({
  selector: 'app-current-weather',
  imports: [
    Button,
    MeterGroup,
    Card,
    ProgressSpinner,
    OverlayBadge,
    Avatar,
  ],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css'
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  private dialogService: DialogService = inject(DialogService);
  private authService: AuthService = inject(AuthService);
  private weatherService: WeatherService = inject(WeatherService);

  // Array of city weather data
  cityWeathers: CityWeather[] = [];

  // For storing subscription references for cleanup
  private subscriptions = new Subscription();

  ngOnInit() {
    // Subscribe to user changes to reload weather when user changes
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        if (user && user.cities && user.cities.length > 0) {
          // Process all cities and load weather data
          this.processCities(user.cities, user.temperatureUnit);
        } else {
          this.cityWeathers = [];
        }
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }

  processCities(cities: City[], unit: 'metric' | 'imperial') {
    // Create a new array for city weathers
    const newCityWeathers: CityWeather[] = [];

    // Process each city
    cities.forEach(city => {
      // Create entry for this city
      const cityWeather: CityWeather = {
        city,
        weatherData: null,
        loading: true,
        error: false,
        values: this.getDefaultMeterValues()
      };

      // Add to array
      newCityWeathers.push(cityWeather);

      // Load weather data
      this.loadWeatherData(city.name, unit, newCityWeathers.length - 1, newCityWeathers);
    });

    // Update city weathers array
    this.cityWeathers = newCityWeathers;
  }

  getDefaultMeterValues() {
    return [
      {label: 'Current temperature', color1: '#34d399', color2: '#fbbf24', value: 0, unit: '°C', icon: 'pi pi-sun', iconUrl: ''},
      {label: 'High Temperature', color1: '#fbbf24', color2: '#60a5fa', value: 0, unit: '°C', icon: 'pi pi-arrow-up', iconUrl: ''},
      {label: 'Low Temperature', color1: '#60a5fa', color2: '#c084fc', value: 0, unit: '°C', icon: 'pi pi-arrow-down', iconUrl: ''},
      {label: 'Weather Condition', color1: '#c084fc', color2: '#c084fc', value: 0, unit: '%', icon: 'pi pi-cloud', iconUrl: '', overcastString: ''}
    ];
  }

  loadWeatherData(cityName: string, units: 'metric' | 'imperial', index: number, cityWeathers: CityWeather[]) {
    console.log(`Loading weather data for ${cityName}`);

    this.weatherService.getCurrentWeather(cityName, units).subscribe({
      next: (data) => {
        console.log(`Weather data loaded for ${cityName}`, data);

        // Update city weather data
        cityWeathers[index].weatherData = data;
        cityWeathers[index].loading = false;
        cityWeathers[index].values = this.createMeterValues(data, units);

        // Also update the main array if index exists
        if (this.cityWeathers[index]) {
          this.cityWeathers[index] = {...cityWeathers[index]};
        }
      },
      error: (err) => {
        console.error(`Error loading weather data for ${cityName}:`, err);

        // Update error state
        cityWeathers[index].error = true;
        cityWeathers[index].loading = false;

        // Also update the main array if index exists
        if (this.cityWeathers[index]) {
          this.cityWeathers[index] = {...cityWeathers[index]};
        }
      }
    });
  }

  createMeterValues(data: WeatherData, units: 'metric' | 'imperial') {
    // Get weather icon URL from the icon code
    const weatherIconUrl = this.getWeatherIconUrl(data.weatherIcon);

    // Calculate overcast percentage based on weather condition
    const overcastValue = this.calculateOvercastValue(data.weatherMain);

    const iconCode = data.weatherIcon; // This is the code like "01d" or "03n"

    // Temperature unit suffix
    const unitSuffix = units === 'metric' ? '°C' : '°F';

    // Create meter values with real data
    return [
      {
        label: 'Current temperature',
        color1: '#34d399',
        color2: '#fbbf24',
        value: Math.abs(data.temperature),
        unit: unitSuffix,
        icon: 'pi pi-sun', // Fallback icon
        iconUrl: weatherIconUrl,
        iconCode:iconCode
      },
      {
        label: 'High Temperature',
        color1: '#fbbf24',
        color2: '#60a5fa',
        value: Math.abs(data.tempMax),
        unit: unitSuffix,
        icon: 'pi pi-arrow-up',
        iconUrl: ''
      },
      {
        label: 'Low Temperature',
        color1: '#60a5fa',
        color2: '#c084fc',
        value: Math.abs(data.tempMin),
        unit: unitSuffix,
        icon: 'pi pi-arrow-down',
        iconUrl: ''
      },
      {
        label: 'Weather Condition',
        color1: '#c084fc',
        color2: '#c084fc',
        value: overcastValue,
        unit: '%',
        icon: 'pi pi-cloud', // Fallback icon
        iconUrl: weatherIconUrl,
        overcastString: data.weatherMain,
      }
    ];
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  calculateOvercastValue(weatherMain: string): number {
    // Map different weather conditions to approximate overcast percentages
    switch (weatherMain) {
      case 'Clear': return 3;
      case 'Few clouds': return 5;
      case 'Scattered clouds': return 15;
      case 'Broken clouds':
      case 'Clouds': return 2;
      case 'Overcast clouds': return 4;
      case 'Mist':
      case 'Fog':
      case 'Haze': return 9;
      case 'Rain':
      case 'Drizzle':
      case 'Shower rain': return 10;
      case 'Thunderstorm': return 23;
      case 'Snow': return 15;
      default: return 20; // Default value for unknown conditions
    }
  }

  onAddCityClick() {
    this.dialogService.openAddCityDialog();
  }

  onRemoveCityClick(cityName: string) {
    if (cityName) {
      this.authService.removeCity(cityName);
    }
  }

  // Get city display with country
  getCityDisplay(cityWeather: CityWeather): string {
    if (!cityWeather.weatherData) return cityWeather.city.name;
    return `${cityWeather.weatherData.cityName}, ${cityWeather.weatherData.countryCode}`;
  }

  // Get formatted date
  getWeatherDate(cityWeather: CityWeather): string {
    if (!cityWeather.weatherData) return '';
    return cityWeather.weatherData.date.toLocaleString();
  }


  // Get whether the icon represents day or night
  getDayOrNight(iconCode: string): string {
    // OpenWeatherMap icon codes end with 'd' for day and 'n' for night
    // Examples: 01d.png, 02n.png, etc.
    if (!iconCode) return 'Day'; // Default to day if no icon code

    // Check the second-to-last character (before .png if it's included)
    const normalizedCode = iconCode.replace('.png', '');

    // The last character determines day or night
    const lastChar = normalizedCode.charAt(normalizedCode.length - 1);


    return lastChar === 'd' ? 'Day' : 'Night';
  }
}
