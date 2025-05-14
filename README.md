# WeatherApp

A modern, responsive weather application built with Angular, PrimeNG, and Tailwind CSS. This application allows users to track weather conditions for multiple cities, view detailed 5-day forecasts, and customize their experience.

![Weather App Screenshot](https://via.placeholder.com/800x450)
![Weather App Dark Mode](https://via.placeholder.com/800x450)
![Weather App Forecast View](https://via.placeholder.com/800x450)

## Features

- **User Authentication**: Simple login system with persistent sessions
- **City Management**: Add and remove cities from your personal dashboard
- **Current Weather**: View real-time weather data including temperature, conditions, and more
- **5-Day Forecast**: Detailed forecast with temperature trends, precipitation chances, and wind data
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- **Unit Preferences**: Choose between metric (°C) and imperial (°F) units

## Tech Stack

- **Angular 19**: Featuring the latest Angular features including standalone components and control flow
- **PrimeNG**: High-quality UI component library for consistent and beautiful interfaces
- **Tailwind CSS**: Utility-first CSS framework for highly customized styling
- **OpenWeatherMap API**: Reliable weather data source with global coverage
- **Local Storage**: For persistent user preferences across sessions

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Usage

### Authentication
- Use any email address with password `test1234` to log in
- Session persists until browser is closed or user logs out

### Adding Cities
1. Click the "Add City" button
2. Enter a city name
3. Select your preferred temperature unit
4. Click "Add"

### Viewing Forecasts
- Click on the "View 5-Day Forecast" button on any city card
- The forecast page shows detailed information including:
  - Temperature trends chart
  - Daily weather cards
  - Detailed forecast table

### Customizing Preferences
- Toggle dark/light mode using the theme button
- Change temperature units when adding cities or in settings

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── current-weather/
│   │   ├── forecast-weather/
│   │   ├── city-search-dialog/
│   │   ├── login-screen/
│   │   └── ...
│   ├── services/
│   │   ├── auth/
│   │   ├── weather/
│   │   ├── dialog/
│   │   └── ...
│   ├── models/
│   │   ├── user.ts
│   │   ├── weather.model.ts
│   │   └── ...
│   ├── guards/
│   │   └── auth.guard.ts
│   └── ...
├── assets/
└── environments/
```

## Development Notes

### Authentication
- The application uses a simplified authentication system for demo purposes
- In a production environment, this should be replaced with a secure auth service

### Weather API
- The OpenWeatherMap API provides data in 3-hour intervals
- The application processes this data to create daily forecasts

### Responsive Design
- The application uses a mobile-first approach with responsive breakpoints for larger screens
- Tailwind's utility classes handle most of the responsive behavior

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather data API
- [PrimeNG](https://primeng.org/) for the amazing UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Angular](https://angular.io/) for the robust framework
