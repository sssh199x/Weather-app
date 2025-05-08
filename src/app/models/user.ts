export interface City {
  name: string;
  added: Date;
}

export interface User {
  email: string;
  id?: string;
  cities?: City[]; // Array of cities the user has added
  temperatureUnit: 'celsius' | 'imperial'; // User preference for temperature units
}
