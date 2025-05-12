import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ForecastDay, ForecastResponse, WeatherData, WeatherResponse} from '../../models/weather.model';
import {catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey: string = "ebb4f0773427dc8d8ab69c1888a41f9a";
  private baseUrl = 'https://api.openweathermap.org/data/2.5';


  private http = inject(HttpClient);

  // Get current weather for a city
  getCurrentWeather(city: string, units: 'metric' | 'imperial' = 'metric') {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=${units}`;
    return this.http.get<WeatherResponse>(url).pipe(
      map(response => this.transformWeatherData(response, units)),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Could not fetch weather data. Please try again.'));
      })
    );

  }

  // Get 5-day forecast for a city
  getForecast(city: string, units: 'metric' | 'imperial' = 'metric'): Observable<ForecastDay[]> {
    const url = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=${units}`;

    return this.http.get<ForecastResponse>(url).pipe(
      map(response => this.transformForecastData(response, units)),
      catchError(error => {
        console.error('Error fetching forecast data:', error);
        return throwError(() => new Error('Could not fetch forecast data. Please try again.'));
      })
    );
  }

  // Transform API response to our WeatherData model
  transformWeatherData(weatherData: WeatherResponse, units: 'metric' | 'imperial'): WeatherData {
    console.log(weatherData);
    return <WeatherData>{
      cityName: weatherData.name,
      countryCode: weatherData.sys.country,
      temperature: weatherData.main.temp,
      tempMin: weatherData.main.temp_min,
      tempMax: weatherData.main.temp_max,
      humidity: weatherData.main.humidity,
      weatherMain: weatherData.weather[0].main,
      weatherDescription: weatherData.weather[0].description,
      weatherIcon: weatherData.weather[0].icon,
      windSpeed: weatherData.wind.speed,
      date: new Date(weatherData.dt * 1000),
      coord: weatherData.coord
    }
  }

  // Transform forecast API response to our ForecastDay model
  private transformForecastData(data: ForecastResponse, units: 'metric' | 'imperial'): ForecastDay[] {
    // Group by day and calculate min/max
    const dailyData = new Map<string, {
      temps: number[];
      weatherCounts: Map<string, number>;
      icons: Map<string, number>;
      date: Date;
    }>();

    // Process each forecast entry (every 3 hours)
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          temps: [],
          weatherCounts: new Map<string, number>(),
          icons: new Map<string, number>(),
          date
        });
      }

      const dayData = dailyData.get(dayKey)!;

      // Add temperature
      dayData.temps.push(item.main.temp);

      // Count weather conditions to find most common
      const weather = item.weather[0].main;
      const icon = item.weather[0].icon;

      dayData.weatherCounts.set(
        weather,
        (dayData.weatherCounts.get(weather) || 0) + 1
      );

      dayData.icons.set(
        icon,
        (dayData.icons.get(icon) || 0) + 1
      );
    });

    // Convert to forecast days
    const forecastDays: ForecastDay[] = [];

    dailyData.forEach((data, dayKey) => {
      // Find most common weather condition
      let maxCount = 0;
      let mostCommonWeather = '';

      data.weatherCounts.forEach((count, weather) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonWeather = weather;
        }
      });

      // Find most common icon
      maxCount = 0;
      let mostCommonIcon = '';

      data.icons.forEach((count, icon) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonIcon = icon;
        }
      });

      // Calculate min and max temperatures
      const tempMax = Math.max(...data.temps);
      const tempMin = Math.min(...data.temps);

      // Get day of week
      const dayOfWeek = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(data.date);

      forecastDays.push({
        date: data.date,
        dayOfWeek,
        tempMax,
        tempMin,
        weatherMain: mostCommonWeather,
        weatherIcon: mostCommonIcon
      });
    });

    // Sort by date
    forecastDays.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Return the next 5 days
    return forecastDays.slice(0, 5);
  }

  // Helper to get weather icon URL
  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  // Convert from one unit to another
  convertTemperature(temp: number, from: 'celsius' | 'imperial', to: 'celsius' | 'imperial'): number {
    if (from === to) return temp;

    if (from === 'celsius' && to === 'imperial') {
      return (temp * 9 / 5) + 32; // Celsius to Fahrenheit
    } else {
      return (temp - 32) * 5 / 9; // Fahrenheit to Celsius
    }
  }

}
