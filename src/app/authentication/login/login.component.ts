import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  Loading = false;
  private loadingSub!: Subscription;

  constructor(private authService: AuthService) {
    this.loadingSub = this.authService.authLoading$
      .subscribe(isLoading => (this.Loading = isLoading));
  }

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.authService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
