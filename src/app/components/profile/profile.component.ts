import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem, MenuItemCommandEvent,} from 'primeng/api';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    Button,
    Menu
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  items: MenuItem[] | undefined;
  // Inject the services you need
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            command:(event: MenuItemCommandEvent) => this.navigateToSettings()
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command:(event: MenuItemCommandEvent) => this.logout()
          }
        ]
      }
    ];
  }

  // Method to handle Settings click
  navigateToSettings() {
    console.log('Settings clicked');
    // Navigate to settings page
    this.router.navigate(['/settings']);
  }

  // Method to handle Logout click
  logout() {
    console.log('Logout clicked');
    // Call the logout method from your auth service
    this.authService.logout();
    // The auth service will typically handle navigation to the login page
  }
}
