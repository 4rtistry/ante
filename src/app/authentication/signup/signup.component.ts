import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnDestroy {

  Loading = false;

  private loadingSub!: Subscription;

  constructor(private authService: AuthService) {

    this.loadingSub = this.authService.authLoading$
      .subscribe(isLoading => (this.Loading = isLoading));
  }

  onSignup(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.authService.CreateUser(form.value.email, form.value.password);
  }


  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
