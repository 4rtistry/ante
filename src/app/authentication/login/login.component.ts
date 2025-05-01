import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  Loading = false;

  constructor(public authservice: AuthService){}  

  onLogin(form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    this.Loading = true;
    this.authservice.loginUser(form.value.email, form.value.password);  
  }  
}
