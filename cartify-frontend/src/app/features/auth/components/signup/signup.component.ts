import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Import Router
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signUpForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  success = '';
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { // ✅ Inject Router
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.signUpForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.signUpForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.signup(this.signUpForm.value).subscribe({
      next: (res: { message: string; }) => {
        this.success = res.message || 'Account created successfully!';
        //this.authService.setToken(res.token);
        this.loading = false;
        this.signUpForm.reset();
        this.submitted = false;

        // ✅ Redirect to product list
        this.router.navigate(['/products']);
      },
      error: (err: any) => {
        // If your backend sends { message: '...' }
        this.error = err?.error?.message || 'Server error. Please try again later.';
        this.loading = false;
      }
    });
  }
}
