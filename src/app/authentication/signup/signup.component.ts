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

  /** bound to the template to show / hide the spinner */
  Loading = false;

  /** keeps the subscription so we can unsubscribe */
  private loadingSub!: Subscription;

  constructor(private authService: AuthService) {
    /* listen once – whenever the service emits, update the flag */
    this.loadingSub = this.authService.authLoading$
      .subscribe(isLoading => (this.Loading = isLoading));
  }

  /** template → (ngSubmit)="onSignup(f)" */
  onSignup(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    /* The service will emit Loading=true/false for us */
    this.authService.CreateUser(form.value.email, form.value.password);
  }

  /* prevent memory-leaks */
  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
