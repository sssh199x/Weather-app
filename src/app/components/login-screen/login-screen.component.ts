// import {Component, inject} from '@angular/core';
// import {Card} from 'primeng/card';
// import {Button} from 'primeng/button';
// import {Divider} from 'primeng/divider';
// import {InputText} from 'primeng/inputtext';
// import {AuthService} from '../../services/auth.service';
// import {FormsModule} from '@angular/forms';
// import {MessageService} from 'primeng/api';
// import {Toast} from 'primeng/toast';
// import {Router} from '@angular/router';
//
// @Component({
//   selector: 'app-login-screen',
//   imports: [
//     Card,
//     Button,
//     Divider,
//     InputText,
//     FormsModule,
//     Toast
//   ],
//   providers: [MessageService],
//   templateUrl: './login-screen.component.html',
//   styleUrl: './login-screen.component.css'
// })
// export class LoginScreenComponent {
//
//   email: string = "";
//   password: string = "";
//   loading: boolean = false;
//
//
//   authService: AuthService = inject(AuthService);
//   messageService: MessageService = inject(MessageService);
//   router: Router = inject(Router);
//
//
//   onLogin() {
//     console.log("Login");
//     this.loading = true;
//
//     if (!this.email || !this.password) {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Please enter both email and password'
//       });
//       this.loading = false;
//       return;
//     }
//
//
//     this.authService.login(this.email, this.password).subscribe({
//       next: result => {
//         setTimeout(() => {
//           this.loading = false;
//           this.router.navigate(['/profile']);
//           console.log(result);
//         }, 800);
//
//       },
//       error: (error) => {
//         this.loading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Login Failed',
//           detail: 'Please use test1234 as the password'
//         });
//       }
//     });
//
//
//   }
//
//   toggleDarkMode() {
//     const element = document.querySelector('html');
//     element?.classList.toggle('my-app-dark');
//   }
//
//
// }


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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
      next: result => {
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/main-page']);
          console.log(result);
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
