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

  // Session storage key for user data
  private readonly USER_STORAGE_KEY = 'weatherAppUser';


  private router: Router = inject(Router);


  constructor() {
    // When the service is created, it automatically checks if a user session exists in sessionStorage.
    this.loadUserFromSessionStorage();
  }


  private loadUserFromSessionStorage() {
    const userData = sessionStorage.getItem(this.USER_STORAGE_KEY);

    if (userData) {
      try {
        const user: User | null = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (err) {
        console.log(err);
        // Invalid JSON in storage
        sessionStorage.removeItem(this.USER_STORAGE_KEY);
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Uses the double-bang operator to convert the currentUserValue to a boolean—true if a user exists, false otherwise.
  public isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

// Login Method
  login(email: string, password: string): Observable<User> {

    if (password !== "test1234") {
      return throwError(() => new Error('Invalid email or password'));
    }

    // Create a user object
    const user: User = {
      email,
      id: '1', // In a real app, this would come from your backend
      cities: [], // Start with empty cities array
      temperatureUnit: 'metric' // Default temperature unit
    };
    // Store user in session storage
    sessionStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));

    // Update the current user subject
    this.currentUserSubject.next(user);

    return of(user);
  }


  // Logout method
  public logout(): void {
    // Remove user from session storage
    sessionStorage.removeItem(this.USER_STORAGE_KEY);

    // Update the current user subject
    this.currentUserSubject.next(null);

    // Navigate to login page
    this.router.navigate(['']);
  }


  // Update user preferences
  public updateUserPreferences(updates: Partial<User>): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      // Create updated user object
      const updatedUser = { ...currentUser, ...updates };

      // Store in session storage
      sessionStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));

      // Update the current user subjects
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


}
