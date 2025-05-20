import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs!: Subscription;
  public userIsAuthenticated = false;
  public userEmail: string = '';
  public isMobile: boolean = false;
  public menuOpen: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkScreenWidth();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = this.authService.getUserEmail();

    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userEmail = this.authService.getUserEmail();
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.menuOpen = false;
  }

  @HostListener('window:resize')
  checkScreenWidth() {
    this.isMobile = window.innerWidth <= 480;
    if (!this.isMobile) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
