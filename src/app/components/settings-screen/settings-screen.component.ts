import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-settings-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButton,
    Button,
    Divider,
    Toast,
    Card
  ],
  providers: [MessageService],
  templateUrl: './settings-screen.component.html',
  styleUrl: './settings-screen.component.css'
})
export class SettingsScreenComponent implements OnInit {
  // Selected temperature unit
  selectedUnit: 'metric' | 'imperial' = 'metric';
  // Redirection state
  isRedirecting = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user's temperature unit preference
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.selectedUnit = currentUser.temperatureUnit;
    }
  }

  // Save user's temperature unit preference
  saveSettings() {
    // Set redirecting state
    this.isRedirecting = true;

    // Update user preference
    this.authService.updateUserPreferences({ temperatureUnit: this.selectedUnit });

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: `Temperature will now be displayed in ${this.selectedUnit === 'metric' ? 'Celsius' : 'Fahrenheit'}`
    });

    // Navigate back to weather page after a delay
    setTimeout(() => {
      this.router.navigate(['/main-page']);
    }, 2000); // Longer delay to show the redirection message
  }

  // Cancel changes
  cancelChanges() {
    // Navigate back without saving
    this.isRedirecting = true;
    setTimeout(() => {
      this.router.navigate(['/main-page']);
    }, 2000);
  }

  // Get the formatted display text for current setting
  get currentSettingDisplay(): string {
    return this.selectedUnit === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)';
  }
}
