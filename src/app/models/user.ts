export interface City {
  name: string;
  added: Date;
}

export interface User {
  email: string;
  id?: string;
  cities?: City[]; // Array of cities the user has added
  temperatureUnit: 'metric' | 'imperial'; // User preference for temperature units
}
