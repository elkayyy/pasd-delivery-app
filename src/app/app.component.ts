import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/interfaces/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public authS: AuthService, private router: Router) {}

  handleLoginClick = (user: User | undefined) => {
    if (user) {
      this.authS.logout();
    }
    this.router.navigateByUrl('/login');
  };
}
