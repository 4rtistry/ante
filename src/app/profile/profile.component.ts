import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  onChangePassword(form: NgForm) {
    if (form.invalid) return;

    const { currentPassword, newPassword } = form.value;

    this.authService.changePassword(currentPassword, newPassword)
      .subscribe({
        next: res => {
          this.message = res.message;
          this.error = '';
          form.resetForm();
        },
        error: err => {
          this.message = '';
          this.error = err.error?.message || 'Something went wrong.';
        }
      });
  }
}
