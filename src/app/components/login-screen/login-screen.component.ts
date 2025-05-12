import {Component, inject, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {InputText} from 'primeng/inputtext';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {Router} from '@angular/router';
import {Message} from 'primeng/message';
import {toggleDarkMode} from '../../../shared/utils/theme.utils';

@Component({
  selector: 'app-login-screen',
  imports: [
    Card,
    Button,
    Divider,
    InputText,
    ReactiveFormsModule,
    Toast,
    Message
  ],
  providers: [MessageService],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  // Reference the imported function directly
  toggleDarkMode = toggleDarkMode;

  authService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    // Initialize the form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/main-page']);
    }
  }

  onLogin() {
    console.log("Login");
    this.loading = true;

    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check your inputs and try again'
      });
      this.loginForm.markAllAsTouched(); // This will trigger error messages to show
      this.loading = false;
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: user => {
        // Success - briefly delay for UX
        setTimeout(() => {
          this.loading = false;

          // Show welcome message based on whether user has cities
          if (!user.cities || user.cities.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Welcome',
              detail: 'Please add your first city to get started'
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Welcome Back',
              detail: `Successfully loaded ${user.cities.length} saved cities`
            });
          }

          // Navigate to main page
          this.router.navigate(['/main-page']);
        }, 800);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Please use test1234 as the password'
        });
      }
    });
  }

  // Helper methods for template
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  // Fixed method - now it correctly accepts a control name parameter
  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control !== null && control.invalid && (control.dirty || control.touched);
  }
}
