import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {User} from '../../models/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // BehaviorSubject to keep track of the current user state
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  // Observable that components can subscribe to
  public currentUser$ = this.currentUserSubject.asObservable();

  // Storage keys
  private readonly SESSION_AUTH_KEY = 'weatherAppSession';  // Session authentication
  private readonly LOCAL_CITIES_KEY = 'weatherAppCities_';  // User cities (with email prefix)
  private readonly LOCAL_UNIT_KEY = 'weatherAppUnit_';      // Temperature unit preference (with email prefix)

  private router: Router = inject(Router);

  constructor() {
    // Check if user is authenticated in this session
    this.checkSession();
  }

  private checkSession() {
    const userSession = sessionStorage.getItem(this.SESSION_AUTH_KEY);

    if (userSession) {
      try {
        const sessionData = JSON.parse(userSession);
        // Recreate user object with session auth + localStorage preferences
        this.loadUserWithPreferences(sessionData.email, sessionData.id);
      } catch (err) {
        console.error('Invalid session data:', err);
        sessionStorage.removeItem(this.SESSION_AUTH_KEY);
      }
    }
  }

  // Load user with their stored preferences
  private loadUserWithPreferences(email: string, id: string) {
    // Get cities from localStorage (if exists)
    const citiesJson = localStorage.getItem(`${this.LOCAL_CITIES_KEY}${email}`);
    const cities = citiesJson ? JSON.parse(citiesJson) : [];

    // Get temperature unit preference (if exists)
    const unitPreference = localStorage.getItem(`${this.LOCAL_UNIT_KEY}${email}`);
    const temperatureUnit = unitPreference || 'metric'; // Default to metric if not set

    const user: User = {
      email,
      id,
      cities,
      temperatureUnit: temperatureUnit as 'metric' | 'imperial'
    };

    this.currentUserSubject.next(user);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Login Method
  login(email: string, password: string): Observable<User> {
    if (password !== "test1234") {
      return throwError(() => new Error('Invalid email or password'));
    }

    // Create session authentication data
    const sessionData = {
      email,
      id: crypto.randomUUID() // Generate a unique session ID
    };

    // Store auth in sessionStorage (clears when browser closes)
    sessionStorage.setItem(this.SESSION_AUTH_KEY, JSON.stringify(sessionData));

    // Load user with stored preferences
    this.loadUserWithPreferences(email, sessionData.id);

    return of(this.currentUserValue!);
  }

  // Logout method
  public logout(): void {
    // Remove session authentication
    sessionStorage.removeItem(this.SESSION_AUTH_KEY);

    // Update the current user subject
    this.currentUserSubject.next(null);

    // Navigate to login page
    this.router.navigate(['']);
  }

  // Update user preferences (persistent across sessions)
  public updateUserPreferences(updates: Partial<User>): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      // Create updated user object
      const updatedUser = { ...currentUser, ...updates };

      // Save cities to localStorage if updated
      if (updates.cities) {
        localStorage.setItem(
          `${this.LOCAL_CITIES_KEY}${currentUser.email}`,
          JSON.stringify(updatedUser.cities)
        );
      }

      // Save temperature unit to localStorage if updated
      if (updates.temperatureUnit) {
        localStorage.setItem(
          `${this.LOCAL_UNIT_KEY}${currentUser.email}`,
          updatedUser.temperatureUnit
        );
      }

      // Update the current user subject for the session
      this.currentUserSubject.next(updatedUser);
    }
  }

  // Add city to user's list
  public addCity(cityName: string): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      // Create a new array with the city added (avoid duplicates)
      const cities = currentUser.cities || [];
      if (!cities.some(city => city.name === cityName)) {
        const newCity = {
          name: cityName,
          added: new Date()
        };
        const updatedCities = [...cities, newCity];

        // Update user with new cities array
        this.updateUserPreferences({ cities: updatedCities });
      }
    }
  }

  // Remove city from user's list
  public removeCity(cityName: string): void {
    const currentUser = this.currentUserValue;
    if (currentUser && currentUser.cities) {
      // Filter out the city to remove
      const updatedCities = currentUser.cities.filter(city => city.name !== cityName);

      // Update user with new cities array
      this.updateUserPreferences({ cities: updatedCities });
    }
  }

  // Check if this is user's first login (no cities added)
  public isFirstTimeUser(): boolean {
    const currentUser = this.currentUserValue;
    return currentUser !== null &&
      (!currentUser.cities || currentUser.cities.length === 0);
  }
}
